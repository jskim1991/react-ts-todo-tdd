import TaskStatus from '../../models/TaskStatus'
import { rest } from 'msw'

const FIREBASE_URL = process.env.REACT_APP_FIREBASE_URL as string

export const fetchTasks_incompleteTask_response = rest.get(FIREBASE_URL, async (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json([
            {
                id: '1',
                name: 'Finish course',
                createdOn: Date.now(),
                status: TaskStatus.INCOMPLETE,
            },
        ])
    )
})

export const fetchTasks_empty_response = rest.get(FIREBASE_URL, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]))
})

export const saveTasks_empty_response = rest.put(FIREBASE_URL, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]))
})

export const handlers = [fetchTasks_empty_response, saveTasks_empty_response]
