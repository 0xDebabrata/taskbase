import {useEffect, useState} from "react"
import styles from "../styles/files.module.css"
import {supabase} from "../utils/supabaseClient"
import toast from "react-hot-toast"

export default function File({ id, setFlag, flag, file }) {

    const [misc, setMisc] = useState(false)
    const [hover, setHover] = useState(false)
    const type = file.metadata.mimetype

    const flagValidation = () => {
        const sub = type.substr(0, 5)
        if (sub !== "audio" && sub !== "video" && sub !== "image") {
            console.log(file)
            setMisc(true)
        }
    }

    const handleClick = async (file) => {
        const { signedURL } = await supabase
            .storage
            .from("files")
            .createSignedUrl(`${id}/${file.name}`, 7200)
        window.open(signedURL, "_blank")
    }

    const deleteFile = async () => {
        const { data } = await supabase
            .storage
            .from("files")
            .remove([`${id}/${file.name}`])
        console.log("deleted")
        setFlag(!flag)
    }

    const handleDelete = (e) => {
        e.stopPropagation()
        const promise = deleteFile()
        toast.promise(promise, {
            success: "Deleting file",
            loading: "Deleting",
            error: "A problem occurred"
        })
    }

    const handleDownload = async (e) => {
        e.stopPropagation()
        const { data } = await supabase
            .storage
            .from("files")
            .download(`${id}/${file.name}`)

        const url = window.URL.createObjectURL(data)
        const a = document.createElement("a")
        a.href = url
        a.download = file.name
        a.click()
    }

    useEffect(() => {
        flagValidation()
    }, [])

    return (
        <div className={styles.box}
            onClick={() => {handleClick(file)}}
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className={styles.bg}>
            {type.substr(0, 5) === "audio" && (
                <img src="/audio-icon.svg" />
            )}
            {type.substr(0, 5) === "image" && (
                <img src="/image-icon.svg" />
            )}
            {type.substr(0, 5) === "video" && (
                <img src="/video-icon.svg" />
            )}
            {misc && (
                <img src="/docs-icon.svg" />
            )}
            </div>
            {hover && (
                <div className={styles.wrapper}>
                    <img 
                        onClick={(e) => handleDownload(e)}
                        src="/download-icon.svg" />
                    <img 
                        onClick={(e) => handleDelete(e)}
                        src="/delete-icon.svg" />
                </div>
            )}
            <p>{file.name}</p>
        </div>
    )
}
