import React from 'react'
import Task from './models/Task'

const TaskItems: React.FC<{ tasks: Task[]; onClickHandler: Function }> = (props) => {
    return (
        <ul>
            {props.tasks.map((task) => (
                <li key={task.id} onClick={() => props.onClickHandler(task.id)}>
                    <div>{task.name}</div>
                    {task.completedOn ? <span>{`${task.completedOn.toLocaleString()}`}</span> : ''}
                </li>
            ))}
        </ul>
    )
}

export default TaskItems
