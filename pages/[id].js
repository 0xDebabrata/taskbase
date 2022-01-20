import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import ProtectedRoute from "../components/ProtectedRoute"

export default function GroupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!router.isReady) return;

        const { id } = router.query;
        setLoading(false)
    }, [router.query, router.isReady])

    if (loading) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <ProtectedRoute>
            <p>Hello</p>
        </ProtectedRoute>
    )
}

