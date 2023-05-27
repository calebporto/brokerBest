import Image from "next/image"
import style from "../styles/Cadastrar.module.css"
import Link from "next/link"
import CadastrarBox from "@/layout/CadastrarBox"

const Entrar = () => {
    return (
        <div className={style.Cadastrar}>
            <div className={style.Navbar}>
                <div className={style.Container}>
                    <div className={style.Logo}>
                        <Link href={'/'}>
                            <Image priority width={300} height={100} src={'/media/logo2.png'} alt=""/>
                        </Link>
                    </div>
                    <Link href={'/entrar'}>
                        <div className={style.Assinar}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="rgb(255, 255, 96)" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                        </svg>
                        <p>Entrar</p>
                        </div>
                    </Link>
                </div>
            </div>
            <div className={style.EntrarBody}>
                <CadastrarBox></CadastrarBox>
            </div>
        </div>
    )
}
export default Entrar