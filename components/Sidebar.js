import Image from "next/image"
import { motion } from "framer-motion"

import styles from "../styles/sidebar.module.css"

export default function Sidebar({ tabs, selectedTab, setSelectedTab }) {
    return (
        <div className={styles.container}>
            {tabs.map((tab, i) => {
                return (
                    <div key={i}
                        className={styles.tab}
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
                    </div>
                )
            })}
        </div>
    )
}
