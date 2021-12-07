import React, { FormEvent, useEffect, useRef, useState } from 'react'
import Task from './models/Task'
import TaskStatus from './models/TaskStatus'
import { fetchTasks, saveTasks } from './TaskClient'

const MainPage = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        let isSubscribed = true
        fetchTasks().then((tasks) => {
            if (isSubscribed) {
                setTasks(tasks)
            }
        })

        return () => {
            isSubscribed = false
        }
    }, [])

    const onSubmitHandler = (e: FormEvent) => {
        e.preventDefault()

        const enteredText = inputRef.current!.value
        if (enteredText.trim().length === 0) {
            setErrorMessage('Invalid input')
            return
        }

        const newTask = new Task(enteredText)
        const updatedTasks = [...tasks, newTask]
        saveTasks(updatedTasks).then()
        setTasks(updatedTasks)

        setErrorMessage('')
        inputRef.current!.value = ''
    }

    const onTaskItemClickHandler = (id: string) => {
        const copiedTasks = [...tasks]
        const index = copiedTasks.findIndex((t) => t.id === id)
        const taskToModify = copiedTasks[index]
        if (taskToModify.status === TaskStatus.INCOMPLETE) {
            taskToModify.status = TaskStatus.COMPLETE
            taskToModify.completedOn = Date.now()
        } else {
            taskToModify.status = TaskStatus.INCOMPLETE
            taskToModify.completedOn = undefined
        }
        setTasks(copiedTasks)
        saveTasks(copiedTasks).then()
    }

    const inCompleteTasks =
        tasks &&
        tasks
            .filter((task) => task.status === TaskStatus.INCOMPLETE)
            .map((task) => (
                <li key={task.id} onClick={() => onTaskItemClickHandler(task.id)}>
                    <div>{task.name}</div>
                </li>
            ))
    const completedTasks =
        tasks &&
        tasks
            .filter((task) => task.status === TaskStatus.COMPLETE)
            .map((task) => (
                <li key={task.id} onClick={() => onTaskItemClickHandler(task.id)}>
                    <div>
                        <div>{task.name}</div>
                        {task.completedOn ? <span>{`${task.completedOn.toLocaleString()}`}</span> : ''}
                    </div>
                </li>
            ))

    return (
        <div>
            <form>
                <input type="text" placeholder="Add a task" ref={inputRef} />
                <button onClick={onSubmitHandler}>Add</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}

            <div>
                <h1>Incomplete Tasks</h1>
                <ul>{inCompleteTasks}</ul>
            </div>
            <div>
                <h1>Completed Tasks</h1>
                <ul>{completedTasks}</ul>
            </div>
        </div>
    )
}

export default MainPage
