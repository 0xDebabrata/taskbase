import { supabase } from "../utils/supabaseClient"
import Link from "next/link"
import Navbar from "./Navbar"

import styles from "../styles/Home.module.css"

export default function App() {
    return(
        <div className={styles.container}>
            <p>Your Projects</p>
            <Link href="/new">
                <div className={styles.wrapper}>
                    <p>New project</p>
                </div>
            </Link>
        </div>
    )
}
