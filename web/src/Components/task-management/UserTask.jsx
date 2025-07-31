import { useEffect, useState } from "react"

const UserTask = () => {
    const [userTasks, setUserTasks] = useState([])

    const fetchUsersTasks = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/users-with-tasks')
            const data = await response.json()

            setUserTasks(data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUsersTasks()
    }, [])


    return (
        <div className="ml-60">
            <h1 className="text-2xl font-bold">Users Tasks</h1>
            <hr className="my-4" />
            <div className="grid grid-cols-3 gap-4">
                {userTasks && userTasks?.map((userTask, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-md shadow-md">
                        <h2 className="text-lg font-bold font-sans">{userTask.full_name}</h2>
                        <ul className="my-2 flex flex-col gap-2">
                            {userTask.assigned_tasks?.map((task, idx) => (
                                <li key={idx} className={`text-sm rounded-2xl w-fit font-semibold px-4 text-white font-sans ${task.status === "done" ? "bg-green-600 " : (task.status === "in_progress" ? "bg-yellow-500" : "bg-red-600")}`} >{task.title} </li>
                            ))}

                            {userTask.assigned_tasks?.length === 0 && <li className="text-sm text-slate-600 text-center">No tasks assigned</li>}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserTask