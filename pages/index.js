import { useState, useEffect } from "react"
import { supabase } from "../utils/supabaseClient"
import Auth from "../components/Auth"
import App from "../components/App"

import styles from '../styles/Home.module.css'

export default function Home() {

    const [session, setSession] = useState(null)

    useEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    return (
    <div className={styles.container}>
        {!session ? <Auth /> : <App />}
    </div>
    )
}
