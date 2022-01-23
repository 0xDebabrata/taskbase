import {useState} from "react"
import Sidebar from "./Sidebar"
import Files from "./Files"
import Tasks from "./Tasks"

export default function ControlCentre({ projectId }) {

    const tabs = [{
        name: "Files",
        img: "/files-icon.svg"
    }, {
        name: "Tasks",
        img: "/tasks-icon.svg"
    }, {
        name: "Participants",
        img: "/participants-icon.svg"
    }]

    const [selectedTab, setSelectedTab] = useState(tabs[0])

    return (
        <>
            <Sidebar tabs={tabs}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />
            {selectedTab.name === "Files" && (
                <Files projectId={projectId} />
            )}
            {selectedTab.name === "Tasks" && (
                <Tasks />
            )}
        </>
    )
}
