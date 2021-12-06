import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import userEvent from '@testing-library/user-event'
import * as TaskClient from './TaskClient'
import TaskStatus from './models/TaskStatus'

import { emptySaveTaskStub, emptyTaskStub, oneTaskStub } from './testhelpers/server/handlers'
import { mswServer } from './testhelpers/server/mockHttpServer'
import Task from './models/Task'

describe('Main Page', () => {
    describe('Static tests', () => {
        beforeEach(() => {
            mswServer.use(emptyTaskStub, emptySaveTaskStub)
            render(<App />)
        })

        it('should render text input and submit button', () => {
            expect(screen.getByPlaceholderText(/Add a task/)).toBeInTheDocument()
            expect(screen.getByText(/Add/)).toBeInTheDocument()
        })

        it('should clear input on submit', () => {
            const input = screen.getByPlaceholderText(/Add a task/) as HTMLInputElement
            userEvent.type(input, 'Finish course')
            userEvent.click(screen.getByText(/Add/))

            expect(input.value).toBe('')
        })

        it('should add to list on submit', () => {
            userEvent.type(screen.getByPlaceholderText(/Add a task/) as HTMLInputElement, 'Finish course')
            userEvent.click(screen.getByText(/Add/))

            expect(screen.getByText(/Finish course/)).toBeInTheDocument()
        })

        it('should render incomplete and complete sections', () => {
            expect(screen.getByText(/Incomplete Tasks/)).toBeInTheDocument()
            expect(screen.getByText(/Completed Tasks/)).toBeInTheDocument()
        })

        it('should change task status on click', () => {
            userEvent.type(screen.getByPlaceholderText(/Add a task/) as HTMLInputElement, 'Finish course')
            userEvent.click(screen.getByText(/Add/))
            userEvent.click(screen.getByText(/Finish course/))

            expect(screen.getByText(/Completed Tasks/).nextSibling!.firstChild).not.toBeNull()
        })

        it('should render completed date on completed tasks', () => {
            userEvent.type(screen.getByPlaceholderText(/Add a task/) as HTMLInputElement, 'Finish course')
            userEvent.click(screen.getByText(/Add/))
            userEvent.click(screen.getByText('Finish course'))

            expect(screen.getByText(/Finish course/).nextSibling!.textContent!.length).toBeGreaterThan(0)
        })
    })

    describe('HTTP test', () => {
        beforeEach(() => {
            mswServer.use(emptyTaskStub, emptySaveTaskStub)
        })

        afterEach(() => jest.restoreAllMocks())

        it('should fetch tasks from backend', async () => {
            const fetchSpy = jest.spyOn(TaskClient, 'fetchTasks').mockResolvedValue([])

            render(<App />)

            await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1))
        })

        it('should render fetched tasks', async () => {
            mswServer.use(oneTaskStub)

            render(<App />)

            expect(await screen.findByText(/Finish course/)).toBeInTheDocument()
        })

        it('should send http post on submit', async () => {
            const spy = jest.spyOn(TaskClient, 'saveTasks').mockResolvedValue([])

            render(<App />)

            userEvent.type(screen.getByPlaceholderText(/Add a task/) as HTMLInputElement, 'Finish course')
            userEvent.click(screen.getByText(/Add/))

            expect(spy).toHaveBeenCalledWith(expect.any(String))
            const tasksArgument: Task[] = JSON.parse(spy.mock.calls[0][0].toString())
            expect(tasksArgument[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    name: expect.any(String),
                    createdOn: expect.any(String),
                    status: TaskStatus.INCOMPLETE,
                })
            )
        })

        it('should send http post on status change', async () => {
            mswServer.use(oneTaskStub, emptySaveTaskStub)
            const spy = jest.spyOn(TaskClient, 'saveTasks').mockResolvedValue([])

            render(<App />)

            userEvent.click(await screen.findByText(/Finish course/))
            expect(spy).toHaveBeenCalledWith(expect.any(String))
            const firstTasksArgument: Task[] = JSON.parse(spy.mock.calls[0][0].toString())
            expect(firstTasksArgument[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    name: expect.any(String),
                    createdOn: expect.any(String),
                    completedOn: expect.any(String),
                    status: TaskStatus.COMPLETE,
                })
            )

            userEvent.click(screen.getByText(/Finish course/))
            expect(spy).toHaveBeenCalledWith(expect.any(String))
            const secondTasksArgument: Task[] = JSON.parse(spy.mock.calls[1][0].toString())
            expect(secondTasksArgument[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    name: expect.any(String),
                    createdOn: expect.any(String),
                    status: TaskStatus.INCOMPLETE,
                })
            )
        })
    })

    describe('Input Validation', () => {
        beforeEach(() => {
            mswServer.use(emptyTaskStub, emptySaveTaskStub)
            render(<App />)
        })

        it('should show error when empty input is submitted', () => {
            userEvent.click(screen.getByText(/Add/))
            expect(screen.getByText(/Invalid input/)).toBeInTheDocument()
        })

        it('should clear error message once valid input is submitted', () => {
            userEvent.click(screen.getByText(/Add/))
            expect(screen.getByText(/Invalid input/)).toBeInTheDocument()

            const input = screen.getByPlaceholderText(/Add a task/) as HTMLInputElement
            userEvent.type(input, 'Finish course')
            userEvent.click(screen.getByText(/Add/))
            expect(screen.queryByText(/Invalid input/)).toBeNull()
        })
    })
})
