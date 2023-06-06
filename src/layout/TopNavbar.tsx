import Container from "./Container"
import style from "../styles/TopNavbar.module.css"
import Image from "next/image"
import Link from "next/link"

const TopNavbar = (props: {entrarBt: boolean, cadastrarBt: boolean, perfilBt: boolean | false, fixed: boolean}) => {
    const position = props.fixed ? style.TopNavbarFixed : style.TopNavbarNormal
    
    const entrarBt = () => {
        return props.entrarBt ?
        (
            <Link href={'/entrar'}>
                <div className={style.Entrar}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="rgb(255, 255, 96)" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                    </svg>
                    <p>Entrar</p>
                </div>
            </Link>
        ) : null
    } 

    const cadastrarBt = () => {
        return props.cadastrarBt ?
        (
            <Link href={'/cadastrar'}>
                <div className={style.Assinar}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="rgb(255, 255, 96)" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
                <p>Cadastrar-se</p>
                </div>
            </Link>
        ) : null
    }

    const perfilBt = props.perfilBt ?
    (
        <div></div>
    ) : null

    return (
        <div className={position}>
            <Container>
                <div className={style.Divs}>
                    <div className={style.Logo}>
                        <Image width={300} height={100} src={'/media/logo2.png'} alt=""/>
                    </div>
                    <div className={style.Buttons}>
                        { entrarBt() }
                        { cadastrarBt() }
                    </div>
                </div>
            </Container>
        </div>
    )
}
export default TopNavbar