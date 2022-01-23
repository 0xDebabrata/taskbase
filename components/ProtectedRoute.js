import { supabase } from "../utils/supabaseClient"
import { useEffect, useState } from "react"
import Auth from "./Auth"

export default function Route({ children }) {

    const [session, setSession] = useState(supabase.auth.session() ? supabase.auth.session() : null)

    useEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    return (
        <>
            {session ? children : <Auth />}
        </>
    )
}
