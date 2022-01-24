import {useEffect, useState} from "react"
import { supabase } from "../utils/supabaseClient"
import toast from "react-hot-toast"

import styles from "../styles/participants.module.css"

export default function Participants({ projectId }) {

    const [participants, setParticipants] = useState([])
    const [email, setEmail] = useState("")

    const getParticipants = async () => {
        setParticipants([])

        const { data } = await supabase
            .from("projects")
            .select("participants")
            .eq("id", projectId)

        data[0].participants.forEach(async userId => {
            const { data } = await supabase
                .from("users")
                .select("email")
                .eq("id", userId)

            setParticipants(oldArr => {
                return [...oldArr, data[0].email]
            })
        })
    }

    const sendInvite = async () => {
        const { data: emailExist } = await supabase
            .from("users")
            .select("email")
            .eq("email", email)

        if (emailExist.length === 0) {
            throw new Error("User is not registered")
        }

        const { data: name } = await supabase
            .from("projects")
            .select("name")
            .eq("id", projectId)

        const { data, error } = await supabase
            .from("invites")
            .insert([{
                email,
                project_id: projectId,
                creator_id: supabase.auth.user().id,
                project_name: name[0].name
            }])

        if (error) throw error
        setEmail("")
    }

    const handleInvite = (e) => {
        e.preventDefault()
        const promise = sendInvite()
        toast.promise(promise, {
            success: "Invitation sent",
            loading: "Sending invite",
            error: err => {
                return err.message
            }
        })
    }

    useEffect(() => {
        getParticipants()
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.list}>
                <form 
                    onSubmit={(e) => handleInvite(e)}
                    className={styles.invite}>
                    <input type="email"
                        placeholder="Email address of user to invite"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button 
                        onClick={(e) => handleInvite(e)}
                        type="submit">Invite</button>
                </form>
                {participants.map((person, i) => {
                    return (
                        <div key={i}>
                            <img width="35" height="35" src={`https://ui-avatars.com/api/?name=${person}&size=35&rounded=true&background=EFECFC&color=8561FF`} />
                            <p>{person}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
