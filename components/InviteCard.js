import { supabase } from "../utils/supabaseClient"
import { useRouter } from "next/router"

import styles from "../styles/projectCard.module.css"

export default function InviteCard({ project, setInvitations }) {

    const router = useRouter()

    // TODOOOOO
    const handleAccept = async () => {
        const { data, error } = await supabase
            .rpc("append_array", {
                id: project.project_id,
                new_element: `${supabase.auth.user().id}`
            })
        console.log(data)

        if (!error) {
            setInvitations(oldArr => {
                return oldArr.filter(invite => invite.id !== project.id)
            })

            const { data, error } = await supabase
                .from("invites")
                .delete()
                .eq("id", project.id)

            router.push(`/${project.project_id}`)
        } else {
            console.error(error)
        }
    }

    const handleIgnore = async () => {
        const { data, error } = await supabase
            .from("invites")
            .delete()
            .eq("id", project.id)

        if (!error) {
            setInvitations(oldArr => {
                return oldArr.filter(invite => invite.id !== project.id)
            })
        } else {
            console.error(error)
        }
    }

    return (
        <div className={styles.invite}>
            <div className={styles.wrapper}>
                <h2>{project.project_name}</h2>
                <p>Invited by: {project.users.email}</p>
            </div>
            <div className={styles.btnWrapper}>
                <button
                    onClick={handleAccept}
                    className={styles.accept}
                >
                    Accept
                </button>
                <button
                    onClick={handleIgnore}
                    className={styles.ignore}
                >
                    Ignore 
                </button>
            </div>
        </div>
    )
}
