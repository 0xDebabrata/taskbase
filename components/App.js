import { supabase } from "../utils/supabaseClient"
import Link from "next/link"
import Navbar from "./Navbar"
import Project from "./Project"
import InviteCard from "./InviteCard"

import styles from "../styles/Home.module.css"
import {useEffect, useState} from "react"

export default function App() {

    const [projects, setProjects] = useState([])
    const [invitations, setInvitations] = useState([])

    const getProjects = async () => {
        const { data } = await supabase
            .from("projects")
            .select("*")
            .contains("participants", [supabase.auth.user().id])

        setProjects(data)
    }

    const getInvitations = async () => {
        const { data } = await supabase
            .from("invites")
            .select(`
                users ( email ),
                project_name,
                project_id,
                id,
                email
            `)

        setInvitations(data.filter(project => project.users.email !== supabase.auth.user().email))
    }

    useEffect(() => {
        getProjects()
        getInvitations()
    }, [])

    return(
        <div className={styles.container}>
            <h1>Your Projects</h1>
            {projects.map((project, i) => {
                return(
                    <Project key={i} name={project.name} id={project.id} />
                )
            })}
            <Link href="/new">
                <div className={styles.wrapper}>
                    <p>New project</p>
                </div>
            </Link>
            <h1>Pending Invitations</h1>
            {invitations.map((invite, i) => {
                return(
                    <InviteCard key={i} project={invite} setInvitations={setInvitations} />
                )
            })}
        </div>
    )
}
