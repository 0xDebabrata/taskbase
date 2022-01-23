import Image from "next/image"
import { motion } from "framer-motion"
import {useState} from "react"

import styles from "../styles/sidebar.module.css"

export default function Sidebar({ tabs, selectedTab, setSelectedTab }) {

    const [hover, setHover] = useState(null)

    return (
        <div className={styles.container}>
            {tabs.map((tab, i) => {
                return (
                    <div key={i}
                        className={styles.tab}
                        onMouseOver={() => setHover(tab)}
                        onMouseOut={() => setHover(null)}
                        onClick={() => setSelectedTab(tab)}
                    >
                        <Image src={tab.img}
                            height={35} width={35} 
                            alt="Tab icon"
                        />
                        {selectedTab.name === tab.name ?
                            <motion.div className={styles.accent}
                                layoutId="selected"
                            />
                            :
                            null
                        }
                        {hover === tab && (
                            <div className={styles.tag}>
                                <p>{tab.name}</p>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
