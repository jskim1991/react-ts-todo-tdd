import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { setupWorker } from 'msw'
import { fetchTasks_incompleteTask_response, saveTasks_empty_response } from './testhelpers/server/handlers'

if (process.env.NODE_ENV === 'development') {
    const msw = setupWorker(...[fetchTasks_incompleteTask_response, saveTasks_empty_response])
    msw.start()
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
