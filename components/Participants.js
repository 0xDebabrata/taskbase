import {useEffect, useState} from "react"
import { supabase } from "../utils/supabaseClient"

import styles from "../styles/participants.module.css"

export default function Participants({ projectId }) {

    const [participants, setParticipants] = useState([])

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

    useEffect(() => {
        getParticipants()
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.list}>
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
