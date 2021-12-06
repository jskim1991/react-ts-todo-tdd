import TaskStatus from './TaskStatus'

class Task {
    id: string
    name: string
    createdOn: Date
    completedOn?: Date
    status: TaskStatus

    constructor(taskName: string) {
        this.id = new Date().toISOString()
        this.name = taskName
        this.createdOn = new Date()
        this.status = TaskStatus.INCOMPLETE
    }
}

export default Task
