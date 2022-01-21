import styles from "../styles/projectCard.module.css"

export default function Project({ name, id }) {
    return (
        <div className={styles.card}>
            <h2>{name}</h2>
        </div>
    )
}
