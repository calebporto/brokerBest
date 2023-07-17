import { PremiumDataClass } from "@/classes";
import { PremiumData, Project } from "@/helpers/interfaces";
import { ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const InitialPremiumData = new PremiumDataClass()

export const PremiumContext = createContext<PremiumData>(InitialPremiumData)

export function PremiumProvider(props: {children: ReactNode}) {
    const [premiumProjects, setPremiumProjects] = useState<Array<Project>>([])
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
    const {session} = useContext(AuthContext)

    function getPremium(): null {
        fetch('/api/projects/get-premium-projects')
        .then(response => {
            if (!response.ok) return
            else return response.json()
            .then((data: Array<Project>) => {
                setPremiumProjects(data)
                setLastUpdate(new Date())
            })
        })
        return null
    }
    function premiumUpdate(getPremium: Function) {
        if (lastUpdate) {
            const dateNow = new Date()
            if (dateNow.getTime() - lastUpdate.getTime() > 600000) {
                getPremium()
            }
        }
    }
    useEffect(() => {
        if (session) {
            getPremium()
        }
    }, [session])

    const context = new PremiumDataClass(
        premiumProjects,
        lastUpdate,
        premiumUpdate
    )

    return (
        <PremiumContext.Provider value={context}>
            {props.children}
        </PremiumContext.Provider>
    )
}