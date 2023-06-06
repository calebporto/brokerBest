import Image from "next/image"
import style from "../styles/Entrar.module.css"
import Link from "next/link"
import LoginBox from "@/layout/LoginBox"
import TopNavbar from "@/layout/TopNavbar"

const Entrar = () => {
    return (
        <div className={style.Entrar}>
            <TopNavbar entrarBt={false} cadastrarBt={true} perfilBt={false} fixed={false}></TopNavbar>
            <div className={style.EntrarBody}>
                <LoginBox></LoginBox>
            </div>
        </div>
    )
}
export default Entrar