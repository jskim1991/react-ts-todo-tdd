import axios from 'axios'
import Task from './models/Task'

export const fetchTasks = async (): Promise<Task[]> => {
    const { data } = await axios.get<Task[]>('https://react-ts-todo-28c59-default-rtdb.firebaseio.com/tasks.json')
    return data
}

export const saveTasks = async (tasks: Task[]) => {
    return await axios.put('https://react-ts-todo-28c59-default-rtdb.firebaseio.com/tasks.json', tasks)
}
