import { useEffect, useRef, useState } from 'react'
import TaskSidebar from '@/Components/task-management/Sidebar'
import { CustomKanban } from '../../Components/task-management/Kanban';
import UserTask from '../../Components/task-management/UserTask';

export default function TaskManager() {
    const [tasks, setTasks] = useState([])

    const [openDropdown, setOpenDropdown] = useState(null)
    const [isSorted, setIsSorted] = useState(false);
    const [originalTasks, setOriginalTasks] = useState([]);
    const [activeTab, setActiveTab] = useState("tasks");

    const showFilter = useRef(null);
    const showSorts = useRef(null);

    const activeTasks = originalTasks.filter(task => task.status === "todo").length
    const inProgressTasks = originalTasks.filter(task => task.status === "in_progress").length
    const completedTasks = originalTasks.filter(task => task.status === 'done').length


    const changeTaskPriority = async (taskId, newPriority) => {
        const res = await fetch(`http://localhost:5000/tasks/${taskId}/set_priority`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ priority: newPriority })
        })

        if (res.ok) {
            console.log('Priority changed')
        }
    }

    const handlePriorityChange = async (taskId, newPriority) => {
        setTasks(originalTasks.map(task =>
            task.id === taskId ? { ...task, priority: newPriority } : task
        ))
        await changeTaskPriority(taskId, newPriority)
        setOpenDropdown(null)
    }

    const toggleDropdown = (taskId) => {
        setOpenDropdown(openDropdown === taskId ? null : taskId)
    }

    const sortPriority = () => {
        if (!isSorted) {
            const sortedTasks = [...originalTasks].sort((a, b) => {
                if (a.priority === 'low') return -1
                if (a.priority === 'medium' && b.priority === 'low') return 1
                if (a.priority === 'medium' && b.priority === 'high') return -1
                if (a.priority === 'high') return 1
                return 0
            })
            setTasks(sortedTasks)
            setIsSorted(true);
        } else {
            setTasks(originalTasks)
            setIsSorted(false);
        }
    }

    const handleFilter = (status) => {
        if (status === 'Todo') {
            setTasks(originalTasks.filter(task => task.status === 'todo'))
        } else if (status === 'Progress') {
            setTasks(originalTasks.filter(task => task.status === 'in_progress'))
        } else if (status === 'Done') {
            setTasks(originalTasks.filter(task => task.status === 'done'))
        }
        setIsSorted(true)
        showFilter.current.classList.add('hidden')
    }


    const dueDateSort = () => {
        const sortedTasks = [...originalTasks].sort((a, b) => {
            if (a.dueDate < b.dueDate) return -1
            if (a.dueDate > b.dueDate) return 1
            return 0
        })
        setIsSorted(true)
        setTasks(sortedTasks)
    }

    const handleSort = (sort) => {
        if (sort === 'Due Date') {
            dueDateSort()
        } else if (sort === 'Priority') {
            sortPriority()
        }
        showSorts.current.classList.add('hidden')
    }

    const fetchAllTasks = async () => {
        const response = await fetch('http://localhost:5000/tasks')
        const data = await response.json()

        setTasks(data)
        setOriginalTasks(data)
    }

    useEffect(() => {

        fetchAllTasks()
        return () => {
        }
    }, []);

    const clearFilter = () => {
        setTasks(originalTasks);
        setIsSorted(false);
    }


    return (
        <div className="container mx-auto p-4 bg-gray-100 font-sans">
            <TaskSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            {
                activeTab === "tasks" &&
                <div className='ml-80'>
                    <h1 className="text-4xl font-bold text-center mb-6">
                        Task Manager
                    </h1>
                    <div className="grid md:grid-cols-3 grid-cols-2 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="md:text-xl text-base font-semibold mb-2">Active Tasks</h2>
                            <p className="text-4xl font-bold">{activeTasks}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="md:text-xl text-base font-semibold mb-2">In Progress Tasks</h2>
                            <p className="text-4xl font-bold">{inProgressTasks}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="md:text-xl text-base font-semibold mb-2">Completed Tasks</h2>
                            <p className="text-4xl font-bold">{completedTasks}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className='flex justify-between items-center my-4 relative'>
                            <h2 className="text-xl font-semibold mb-4">Task List</h2>
                            <div className='flex gap-4'>
                                <div className="relative">
                                    {
                                        isSorted &&
                                        <button
                                            onClick={clearFilter}
                                            className="text-black py-2 focus:outline-none px-8 w-fit mr-4 text-sm underline"
                                        >Clear Filter
                                        </button>
                                    }
                                    <button
                                        onClick={() => { showSorts.current.classList.toggle('hidden') }}
                                        className="border-slate-300 border-2 rounded-3xl text-black py-2 focus:outline-none px-8 w-fit font-bold"
                                    >Sort </button>
                                    <div ref={showSorts} className="hidden absolute right-0 mt-2 w-48 z-10 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            {['Due Date', 'Priority'].map((sort, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSort(sort)}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                    role="menuitem"
                                                >
                                                    {sort}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className='relative'>

                                    <button
                                        onClick={() => { showFilter.current.classList.toggle('hidden') }}
                                        className="border-slate-300 border-2 rounded-3xl text-black py-2 focus:outline-none px-8 w-fit font-bold"
                                    >Status
                                    </button>
                                    <div ref={showFilter} className="hidden absolute right-0 mt-2 w-48 z-10 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            {['Todo', 'Progress', 'Done'].map((status, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleFilter(status)}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                    role="menuitem"
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul className="space-y-4">
                            {tasks.map((task, idx) => (
                                <li key={idx} className="grid grid-cols-3 place-content-center items-center py-2 bg-gray-100 rounded-lg px-4">
                                    <span className={task.status === "done" ? 'line-through text-gray-500' : ''}>
                                        {task.title}
                                    </span>
                                    <span>
                                        Due Date: {task.dueDate}
                                    </span>
                                    <div className="relative flex justify-center">
                                        <button
                                            onClick={() => toggleDropdown(task.id)}
                                            className="bg-transparent border-2 border-black text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-3xl w-40 text-center ml-auto"
                                        >
                                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                        </button>
                                        {openDropdown === task.id && (
                                            <div className="absolute right-0 top-10 mt-2 w-48 z-10 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                    {['low', 'medium', 'high'].map((priority, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handlePriorityChange(task.id, priority)}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                            role="menuitem"
                                                        >
                                                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            }
            {
                tasks && activeTab === "kanban" && <CustomKanban tasks={tasks} />
            }
            {
                activeTab === "completed" &&
                <div className='ml-80'>
                    <h1 className="text-4xl font-bold text-center mb-6">
                        Task Manager
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-2 font-sans">Completed Tasks</h2>
                            <p className="text-4xl font-bold">{completedTasks}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 font-sans">
                        <div className='flex justify-between items-center my-4 relative'>
                            <h2 className="text-xl font-semibold mb-4">Tasks List</h2>
                        </div>
                        <ul className="space-y-4">
                            {originalTasks
                                .filter(task => task.status === "done")
                                .map((task, idx) => (
                                    <li key={idx} className="flex items-center justify-between py-2 bg-green-200 rounded-lg px-4">
                                        <span className={task.status === "done" ? 'text-gray-800' : ''}>
                                            {task.title}
                                        </span>
                                        <div className="relative">
                                            <button
                                                onClick={() => toggleDropdown(task.id)}
                                                className="bg-black border-2  cursor-default text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-3xl"
                                            >
                                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                            </button>
                                        </div>
                                    </li>
                                ))}

                        </ul>
                    </div>
                </div>
            }
            {
                activeTab === "user" && <UserTask />
            }

        </div>
    )
}