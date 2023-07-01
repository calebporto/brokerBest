import TopNavbar from "@/layout/TopNavbar"
import style from '@/styles/EmailValidate.module.css'
import EmailValidateBox from "@/layout/EmailValidateBox"
import { AuthContext } from "@/contexts/AuthContext"
import { useContext } from "react"

export default () => {
    const { ...context } = useContext(AuthContext)
    return (
        <>
        <TopNavbar entrarBt={false} cadastrarBt={false} perfilBt={false} fixed={false} contextUser={context}/>
        <div className={style.Body}>
            <EmailValidateBox></EmailValidateBox>
        </div>
        </>
    )
}