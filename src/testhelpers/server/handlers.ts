import TaskStatus from '../../models/TaskStatus'
import { rest } from 'msw'

const firebasePath = 'https://react-ts-todo-28c59-default-rtdb.firebaseio.com/tasks.json'

export const fetchTasks_incompleteTask_response = rest.get(firebasePath, async (req, res, ctx) => {
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

export const fetchTasks_empty_response = rest.get(firebasePath, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]))
})

export const saveTasks_empty_response = rest.put(firebasePath, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]))
})

export const handlers = [fetchTasks_empty_response, saveTasks_empty_response]
