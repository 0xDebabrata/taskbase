import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import ProtectedRoute from "../components/ProtectedRoute"
import ControlCentre from "../components/ControlCentre"
import Chat from "../components/Chat"

import styles from "../styles/project.module.css"

export default function GroupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [projectId, setProjectId] = useState(null)

    useEffect(() => {
        if (!router.isReady) return;

        const { id } = router.query;
        setProjectId(id)
        setLoading(false)
    }, [router.query, router.isReady])

    if (loading) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <ControlCentre projectId={projectId} />
                <Chat />
            </div>
        </ProtectedRoute>
    )
}

