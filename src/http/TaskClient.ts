import axios from 'axios'
import Task from '../models/Task'

export const fetchTasks = async () => {
    const { data } = await axios.get<Task[]>(process.env.REACT_APP_FIREBASE_URL as string)
    return data
}

export const saveTasks = async (tasks: Task[]) => {
    await axios.put(process.env.REACT_APP_FIREBASE_URL as string, tasks)
}
