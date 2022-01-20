import { supabase } from "../utils/supabaseClient"
import Link from "next/link"

import styles from "../styles/navbar.module.css"

export default function Navbar() {
    return (
        <div className={styles.nav}>
            <Link href="/">
                <h1>Taskbase</h1>
            </Link>
            <button
                onClick={() => supabase.auth.signOut()}
            >
                Sign out
            </button>
        </div>
    )
}
