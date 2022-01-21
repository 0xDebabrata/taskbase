import { motion, AnimatePresence } from "framer-motion"
import {useEffect, useState} from "react"
import { useRouter } from "next/router"
import { supabase } from "../utils/supabaseClient"
import Link from "next/link"
import toast from "react-hot-toast"
import ProtectedRoute from "../components/ProtectedRoute"

import styles from "../styles/new.module.css"

export default function New() {

    const tabs = ["Name", "Invite"]
    const [name, setName] = useState("")
    const [invites, setInvites] = useState([])
    const [uuid, setUuid] = useState(null)
    const [selectedTab, setSelectedTab] = useState(tabs[0])

    const createProject = async () => {
        const { data, error } = await supabase
            .from("projects")
            .insert([{
                name, participants: [supabase.auth.user().id]
            }])

        if (error) {
            console.error(error)
            throw error
        } else {
            setUuid(data[0].id)
        }
    }

    const handleNext = (e) => {
        e.preventDefault()
        const promise = createProject()
        toast.promise(promise, {
            success: () => {
                setSelectedTab(tabs[1])
                return "Project created"
            },
            loading: "Creating project",
            error: "Problem creating project"
        })
    }

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <div className={styles.box}>
                    <div className={styles.tabs}>
                        {tabs.map((tab, i) => {
                            return (
                                <div key={i}>
                                    <p>{tab}</p>
                                    {selectedTab === tab ? 
                                        <motion.div className={styles.selected} layoutId="selected" />
                                        :
                                        null}

                                </div>
                            )
                        })}
                    </div>
                    <AnimatePresence exitBeforeEnter>
                        <motion.div
                            key={selectedTab}
                            animate={{opacity: 1, x: 0}}
                            initial={{opacity: 0, x: selectedTab === "Name" ? -20 : 20}}
                            exit={{opacity: 0, x: selectedTab === "Name" ? -20 : 20}}
                            transition={{duration: 0.15}}
                        >
                            {selectedTab === "Name" ? 
                                <Name name={name}
                                    setName={setName}
                                    handleSubmit={handleNext} /> : 
                                <Invite invites={invites}
                                    setInvites={setInvites}
                                    uuid={uuid}
                                    name={name}
                                />}
                        </motion.div>                
                    </AnimatePresence>
                </div>
            </div>
        </ProtectedRoute>
    )
}

const Name = ({ name, setName, handleSubmit }) => {
    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <p>Enter project name</p>
            <>
                <input type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Chemistry Project"
                />
                <button type="submit"
                >
                    Next
                </button>
            </>
        </form>
    )
}

const Invite = ({ invites, setInvites, uuid, name }) => {

    const [email, setEmail] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [focus, setFocus] = useState(false)

    const router = useRouter()

    const search = async (email) => {
        if (!email) {
            setSuggestions([])
            return;
        }

        const { data } = await supabase
            .from("users")
            .select("email")
            .like("email", `${email}%`)

        const results = data.filter(sugg => sugg.email !== supabase.auth.user().email)
        setSuggestions(results)
    }

    const handleClick = (e) => {
        const input = document.getElementById("search")
        const container = document.getElementById("suggestions")
        if (container && !container.contains(e.target) && !input.contains(e.target)) {
            setFocus(false)
        }
    }

    const sendInvites = async () => {
        const rows = []
        invites.forEach(email => {
            rows.push({ 
                email, 
                project_id: uuid,
                creator_id: supabase.auth.user().id,
                project_name: name 
            })
        })

        const { data, error } = await supabase
            .from("invites")
            .insert(rows)

        if (error) throw error
    }

    const handleInvite = () => {
        const promise = sendInvites()
        toast.promise(promise, {
            success: () => {
                router.push(`/${uuid}`)
                return "Invitations sent"
            },
            loading: "Sending invitations",
            error: err => {
                console.error(err)
                return "An error occurred"
            }
        })
    }

    const removeMember = (email) => {
        setInvites(oldArr => {
            return oldArr.filter(user => user !== email)
        })
    }

    useEffect(() => {
        document.addEventListener("click", handleClick)
        return () => document.removeEventListener("click", handleClick)
    })

    return (
        <div className={styles.inviteContainer}>
            <p>Invite members</p>
            {invites.map((member, i) => {
                return (
                    <div key={i} className={styles.wrapper}>
                        <p>{member}</p>
                        <img src="/cross-icon.svg"
                            height="28px"
                            width="28px"
                            alt="Delete member icon"
                            onClick={() => removeMember(member)}
                        />
                    </div>
                )
            })}
            <div className={styles.search}>
                <input type="email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        search(e.target.value)
                    }}
                    id="search"
                    placeholder="Email (User needs to be registered)"
                    onFocus={() => setFocus(true)}
                />
                {focus && (
                    <Suggestions 
                        setEmail={setEmail}
                        setFocus={setFocus}
                        setInvites={setInvites}
                        arr={suggestions} />
                )}
            </div>
            <div className={styles.btnWrapper}>
                <Link href={`/${uuid}`}
                >
                    Skip
                </Link>
                <button disabled={invites.length ? false : true}
                    onClick={handleInvite}
                >Send invitation</button>
            </div>
        </div>
    )
}

const Suggestions = ({ setEmail, setFocus, setInvites, arr }) => {
    if (!arr.length) return null;

    const handleClick = (email) => {
        setInvites(oldArr => {
            return [...oldArr, email]
        })
        setFocus(false)
        setEmail("")
    }

    return (
        <ul id="suggestions" className={styles.suggestions}>
            {arr.map((obj, i) => {
                return (
                    <li key={i}
                        onClick={() => handleClick(obj.email)}
                    >
                        {obj.email}
                    </li>
                )
            })}
        </ul>
    )
}
