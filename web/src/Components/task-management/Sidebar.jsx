/* eslint-disable react/prop-types */
import { ListIcon, CheckIcon, DraftingCompass, UserCheck } from 'lucide-react'

const TaskSidebar = ({ activeTab, setActiveTab }) => {
    const openTab = (tab) => {
        setActiveTab(tab)
    }
    return (
        <div className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute h-full top-0 left-0 transform z-50 md:translate-x-0 transition duration-200 ease-in-out`}>
            <nav className='flex flex-col gap-4'>
                <div onClick={() => { openTab("tasks") }} className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${activeTab === "tasks" && "bg-gray-700 text-white"}`}>
                    <ListIcon className="inline-block mr-2 h-5 w-5" />
                    Tasks
                </div>
                <div onClick={() => { openTab("kanban") }} className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${activeTab === "kanban" && "bg-gray-700 text-white"}`}>
                    <DraftingCompass className="inline-block mr-2 h-5 w-5" />
                    Kanban Board
                </div>
                <div onClick={() => { openTab("completed") }} className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${activeTab === "completed" && "bg-gray-700 text-white"}`}>
                    <CheckIcon className="inline-block mr-2 h-5 w-5" />
                    Completed
                </div>
                <div onClick={() => { openTab("user") }} className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${activeTab === "user" && "bg-gray-700 text-white"}`}>
                    <UserCheck className="inline-block mr-2 h-5 w-5" />
                    User&apos;s Task
                </div>
            </nav>
        </div>)
}

export default TaskSidebar