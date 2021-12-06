import TaskStatus from '../../models/TaskStatus'
import { rest } from 'msw'

const firebasePath = 'https://react-ts-todo-28c59-default-rtdb.firebaseio.com/tasks.json'

export const oneTaskStub = rest.get(firebasePath, async (req, res, ctx) => {
    return res(
        ctx.json([
            {
                id: '1',
                name: 'Finish course',
                createdOn: new Date(),
                status: TaskStatus.INCOMPLETE,
            },
        ])
    )
})

export const emptyTaskStub = rest.get(firebasePath, async (req, res, ctx) => {
    return res(ctx.json([]))
})

export const emptySaveTaskStub = rest.put(firebasePath, async (req, res, ctx) => {
    return res(ctx.json([]))
})

export const handlers = [oneTaskStub]
