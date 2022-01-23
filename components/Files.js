import {useEffect, useState} from "react"
import { supabase } from "../utils/supabaseClient"
import toast from "react-hot-toast"
import File from "./File"

import styles from "../styles/files.module.css"

export default function Files({ projectId }) {

    const [uploading, setUploading] = useState(false)
    const [files, setFiles] = useState([])
    const [flag, setFlag] = useState(true)

    const uploadFile = async (e) => {
        try {
            setUploading(true)

            if (e.target.files.length === 0 || !projectId) {
                console.log("No file")
                return;
            }

            const file = e.target.files[0]
            const { error: uploadError } = await supabase
                .storage
                .from("files")
                .upload(`${projectId}/${file.name}`, file, {
                    upsert: true
                })

            if (uploadError) throw uploadError;
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            setUploading(false)
            setFlag(!flag)
        }
    }

    const handleSubmit = (e) => {
        const promise = uploadFile(e)
        toast.promise(promise, {
            success: "File uploaded",
            loading: "Uploading file",
            error: "There was a problem"
        })
    }

    const handleClick = () => {
        const input = document.getElementById("file")
        input.click()
    }

    const getFiles = async () => {
        const { data } = await supabase
            .storage
            .from("files")
            .list(`${projectId}`, {
                sortBy: { column: "updated_at", order: "desc"} 
            })

        setFiles(data)
        console.log(data)
    }

    useEffect(() => {
        if (!projectId) return;
        getFiles()
    }, [projectId, flag])

    return (
        <div className={styles.container}>
            <div className={styles.files}>
                {files.map((file, i) => {
                    return (
                        <File id={projectId} setFlag={setFlag} flag={flag} file={file} key={i} />
                    )
                })}
            </div>
            <input type="file"
                onChange={(e) => handleSubmit(e)}
                id="file"
                accept="audio/*, video/*, image/*, .doc, .docx, .pdf"
                style={{display: "none"}}
            />
            <button
                className={styles.button}
                disabled={uploading}
                onClick={handleClick}
            >
                {!uploading ? "Upload file" : "Uploading"}
            </button>
        </div>
    )
}
