import { useState } from "react"
import { supabase } from "../utils/supabaseClient"
import toast from "react-hot-toast"

import styles from "../styles/auth.module.css"

export default function Auth() {

    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (email) => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signIn({ email })
            if (error) throw error.message
        } catch (error) {
            throw new Error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const promise = handleLogin(email)
        toast.promise(promise, {
            success: "Check your email for sign in link",
            error: err => {
                console.log(err.message)
                return err.message
            },
            loading: "Sending email"
        }, {
            style: { minWidth: "300px" },
            success: { duration: 5000 }
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <h1>Taskbase</h1>
                <p>Sign in</p>
                <form 
                    onSubmit={handleSubmit}
                    className={styles.form}
                >
                    <input
                        className={styles.email}
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Loading" : "Send magic link"}
                    </button>
                </form>
            </div>
        </div>
    )
}
