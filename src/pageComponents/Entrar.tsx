import style from "../styles/Entrar.module.css"
import LoginBox from "@/layout/LoginBox"
import TopNavbar from "@/layout/TopNavbar"
import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { checkContextUpdate } from "@/helpers/helpers"

const Entrar = () => {
    const { ...context } = useContext(AuthContext)
    if (context.user.lastUpdate) {
        checkContextUpdate(context)
    }
    return (
        <div className={style.Entrar}>
            <TopNavbar entrarBt={false} cadastrarBt={true} perfilBt={false} fixed={false} contextUser={context}></TopNavbar>
            <div className={style.EntrarBody}>
                <LoginBox></LoginBox>
            </div>
        </div>
    )
}
export default Entrar