import { checkContextUpdate } from "@/helpers/helpers"
import style from "../styles/Cadastrar.module.css"
import CadastrarBox from "@/layout/CadastrarBox"
import TopNavbar from "@/layout/TopNavbar"
import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"

const Cadastrar = () => {
    const { ...context } = useContext(AuthContext)
    if (context.user.lastUpdate) {
        checkContextUpdate(context)
    }
    return (
        <>
            <TopNavbar entrarBt={true} cadastrarBt={false} perfilBt={false} fixed={false} contextUser={context}></TopNavbar>
            <div className={style.Cadastrar}>
                <div className={style.EntrarBody}>
                    <CadastrarBox></CadastrarBox>
                </div>
            </div>
        </>
    )
}
export default Cadastrar