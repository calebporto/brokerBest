import { PremiumDataClass } from "@/classes";
import { PremiumData, Project, Company } from "@/helpers/interfaces";
import { ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const InitialPremiumData = new PremiumDataClass()

export const PremiumContext = createContext<PremiumData>(InitialPremiumData)

export function PremiumProvider(props: {children: ReactNode}) {
    const [premiumProjects, setPremiumProjects] = useState<Array<Company>>([])
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
    const {session} = useContext(AuthContext)

    useEffect(() => {
        if (session) {
            getPremium()
        }
    }, [session])

    function getPremium(): null {
        fetch('/api/projects/get-premium-projects')
        .then(response => {
            if (!response.ok) return
            else return response.json()
            .then((data: Array<Company>) => {
                setPremiumProjects(data)
                setLastUpdate(new Date())
            })
        })
        return null
    }
    function premiumUpdate() {
        if (lastUpdate) {
            const dateNow = new Date()
            if (dateNow.getTime() - lastUpdate.getTime() > 600000) {
                getPremium()
            }
        }
    }
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