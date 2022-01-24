import { supabase } from "../utils/supabaseClient"
import Link from "next/link"

import styles from "../styles/navbar.module.css"
import {useEffect, useState} from "react"

export default function Navbar() {

    const [session, setSession] = useState(supabase.auth.session() ? supabase.auth.session() : null)

    useEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    return (
        <div className={styles.nav}>
            <Link href="/">
                <h1>TaskBase</h1>
            </Link>
            {session && (
                <button
                    onClick={() => supabase.auth.signOut()}
                >
                    Sign out
                </button>
            )}
        </div>
    )
}
