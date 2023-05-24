import Image from "next/image"
import style from "../styles/Entrar.module.css"
import Link from "next/link"
import LoginBox from "@/layout/LoginBox"

const Entrar = () => {
    return (
        <div className={style.Entrar}>
            <div className={style.Navbar}>
                <div className={style.Container}>
                    <div className={style.Logo}>
                        <Link href={'/'}>
                            <Image priority width={300} height={100} src={'/media/logo2.png'} alt=""/>
                        </Link>
                    </div>
                    <Link href={'/cadastrar'}>
                        <div className={style.Assinar}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="rgb(255, 255, 96)" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                        </svg>
                        <p>Cadastrar-se</p>
                        </div>
                    </Link>
                </div>
            </div>
            <div className={style.EntrarBody}>
                <LoginBox></LoginBox>
            </div>
        </div>
    )
}
export default Entrar