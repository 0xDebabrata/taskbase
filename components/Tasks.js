import { supabase } from "../utils/supabaseClient"
import toast from "react-hot-toast"

import styles from "../styles/tasks.module.css"
import {useEffect, useState} from "react"

export default function Tasks({ projectId }) {

    const [flag, setFlag] = useState(true)
    const [pTasks, setPTasks] = useState([])
    const [tasks, setTasks] = useState([])
    const [hidden, setHidden] = useState(true)

    const getTasks = async () => {
        setTasks([])
        setPTasks([])

        const { data } = await supabase
            .from("tasks")
            .select("*")
            .eq("project_id", projectId)
            .order("complete", { ascending: true })
            .order("created_at", { ascending: false })

        data.forEach(task => {
            if (task.email === supabase.auth.user().email) {
                setTasks(oldArr => {
                    return [...oldArr, task]
                })
            }
        })
        setPTasks(data)
    }

    useEffect(() => {
        getTasks()
    }, [flag])

    return (
        <div className={styles.container}>
            <h2>Your tasks</h2>
            {tasks.map((task, i) => {
                if (task.complete) return null
                return (
                    <Task key={i}
                        task={task}
                        flag={flag}
                        setFlag={setFlag}
                    />
                )
            })}
            <h2>Project tasks</h2>
            {pTasks.map((task, i) => {
                return (
                    <TaskCard key={i}
                        task={task}
                        flag={flag}
                        setFlag={setFlag}
                    />
                )
            })}
            <button className={styles.btn} onClick={() => setHidden(!hidden)}>
                {hidden ? "Add task" : "Cancel"}
            </button>
            {!hidden && (
                <New flag={flag} setFlag={setFlag} projectId={projectId} setHidden={setHidden} />
            )}
        </div>
    )
}

const Task = ({ task, setFlag, flag }) => {

    const taskComplete = async () => {
        const { data } = await supabase
            .from("tasks")
            .update({ complete: true })
            .match({ id: task.id })
        setFlag(!flag)
    }

    return (
        <div className={styles.taskContainer}>
            <div className={styles.wrapper}>
                <p className={styles.task}>{task.task}</p>
                {task.assigned_by !== supabase.auth.user().email && (
                    <p className={styles.sub}>Assigned by <span>{task.assigned_by}</span></p>
                )}
            </div>
            <button onClick={taskComplete}>Done</button>
        </div>
    )
}

const TaskCard = ({ task, flag, setFlag }) => {
    const taskComplete = async () => {
        const { data } = await supabase
            .from("tasks")
            .update({ complete: true })
            .match({ id: task.id })
        setFlag(!flag)
    }

    return (
        <div 
            style={task.complete ? {
                background: "transparent",
                border: "2px solid #8561FF"
            } : null}
            className={styles.card}>
            {task.email && (
                <img src={`https://ui-avatars.com/api/?name=${task.email}&background=${task.complete ? "8561FF" : "EFECFC"}&rounded=true&size=35&color=${task.complete ? "EFECFC" : "8561FF"}`} />
            )}
            <p>{task.task}</p>
            {!task.complete && !task.email && (
                <button onClick={taskComplete}>Done</button>
            )}
        </div>
    )
}

const New = ({ projectId, setHidden, flag, setFlag }) => {

    const [participants, setParticipants] = useState([])
    const [task, setTask] = useState("")
    const [email, setEmail] = useState("")

    const getParticipants = async () => {
        setParticipants([])
        const { data } = await supabase
            .from("projects")
            .select("participants")
            .eq("id", projectId)

        data[0].participants.forEach(async uuid => {
            const { data: email } = await supabase
                .from("users")
                .select("email")
                .eq("id", uuid)

            setParticipants(oldArr => [...oldArr, email[0].email])
        })
    }

    const addTask = async () => {
        if (!task) throw new Error("Please add a task")

        const { data, error } = await supabase
            .from("tasks")
            .insert([{
                task,
                email: email ? email : null,
                assigned_by: supabase.auth.user().email,
                project_id: projectId
            }])

        if (error) throw error
        setHidden(true)
        setFlag(!flag)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const promise = addTask()
        toast.promise(promise, {
            success: "Task added",
            loading: "Adding task",
            error: err => {
                return err.message
            }
        })
    }

    useEffect(() => {
        getParticipants()
    }, [])

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input type="text" required
                placeholder="Enter new task*"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className={styles.taskInput}
            />
            <div className={styles.span}>
                <label>Assign</label>
                <select name="Assign task"
                    onChange={(e) => setEmail(e.target.value)}
                >
                    <option value="">No one</option>
                    {participants.map((email, i) => {
                        return (
                            <option key={i} value={email}>{email}</option>
                        )
                    })}
                </select>
            </div>
            <button type="submit"
                onClick={handleSubmit}
            >
                Add task
            </button>
        </form>
    )
}
