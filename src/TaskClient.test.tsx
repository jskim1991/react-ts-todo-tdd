import axios from 'axios'
import { fetchTasks, saveTasks } from './TaskClient'
import TaskStatus from './models/TaskStatus'
import Task from './models/Task'
import { mswServer } from './testhelpers/server/mockHttpServer'
import { fetchTasks_incompleteTask_response } from './testhelpers/server/handlers'

describe('Task Client', () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('fetchTasks should invoke axios get', () => {
        const spy = jest.spyOn(axios, 'get').mockResolvedValue([])

        fetchTasks()

        expect(spy).toHaveBeenCalledWith('https://react-ts-todo-28c59-default-rtdb.firebaseio.com/tasks.json')
    })

    it('fetchTasks should return Task list', async () => {
        mswServer.use(fetchTasks_incompleteTask_response)

        const data: Task[] = await fetchTasks()

        expect(data).toEqual([
            expect.objectContaining({
                id: expect.any(String),
                name: 'Finish course',
                createdOn: expect.any(Number),
                status: TaskStatus.INCOMPLETE,
            }),
        ])
    })

    it('saveTasks should invoke axios put', () => {
        const now = Date.now()
        const spy = jest.spyOn(axios, 'put').mockResolvedValue([])
        const tasks: Task[] = [
            {
                id: '1',
                name: 'Finish course',
                createdOn: now,
                status: TaskStatus.COMPLETE,
            },
        ]

        saveTasks(tasks)

        expect(spy).toHaveBeenCalledWith('https://react-ts-todo-28c59-default-rtdb.firebaseio.com/tasks.json', [
            {
                id: '1',
                name: 'Finish course',
                createdOn: now,
                status: TaskStatus.COMPLETE,
            },
        ])
    })

    it('saveTasks should return axios response', async () => {
        const putResult = await saveTasks([])

        expect(putResult).toEqual(
            expect.objectContaining({
                data: [],
                status: 200,
            })
        )
    })
})
