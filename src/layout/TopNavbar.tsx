import Container from "./Container"
import style from "../styles/TopNavbar.module.css"
import Image from "next/image"
import Link from "next/link"
import { GeneralContext, User } from "@/helpers/interfaces"
import Router, { useRouter } from "next/router"
import { globalSignOut } from "@/helpers/helpers"
import { useEffect, useState } from "react"

const TopNavbar = (props: {
    entrarBt?: boolean,
    cadastrarBt?: boolean,
    perfilBt?: boolean | false,
    fixed?: boolean,
    contextUser: GeneralContext
}) => {
    const { user, windowDimensions, session } = props.contextUser
    const position = props.fixed ? style.TopNavbarFixed : style.TopNavbarNormal
    const isPc = windowDimensions.width as number > 767
    const [open, setOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        window.addEventListener('click', (e) => {
            const perfilBt = document.getElementById('perfilBt') as HTMLDivElement
            const toggleBt = document.getElementById('toggleBt') as HTMLDivElement
            const dropdown = document.getElementById('dropdown') as HTMLDivElement
            const painelBt = document.getElementById('painelBt') as HTMLDivElement
            const empAdminBt = document.getElementById('empAdminBt') as HTMLDivElement
            const sairBt = document.getElementById('sairBt') as HTMLDivElement
            
            if (dropdown) {
                if (e.target != dropdown 
                    && e.target != painelBt 
                    && e.target != empAdminBt 
                    && e.target != sairBt 
                    && e.target != perfilBt
                    && e.target != toggleBt) {
                    setOpen(false)
                }
            }
        })
    }, [setOpen])
    function toggleDropdown() {
        setOpen(!open)
    }

    const entrarBt = () => {
        let button = isPc ?
            (
                <Link href={'/entrar'}>
                    <div className={style.Entrar}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="rgb(255, 255, 96)" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                        </svg>
                        <p>Entrar</p>
                    </div>
                </Link>
            ) : (
                <Link href={'/entrar'}>
                    <div className={style.Entrar}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="rgb(255, 255, 96)" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                        </svg>
                    </div>
                </Link>
            )


        return props.entrarBt && !user.name ? button : null
    }

    const cadastrarBt = () => {
        let button = isPc ?
            (
                <Link href={'/cadastrar'}>
                    <div className={style.Assinar}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="rgb(255, 255, 96)" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                        </svg>
                        <p>Cadastrar-se</p>
                    </div>
                </Link>
            ) : (
                <Link href={'/cadastrar'}>
                    <div className={style.Assinar}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="rgb(255, 255, 96)" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                        </svg>
                    </div>
                </Link>
            )

        return props.cadastrarBt && !user.name ? button : null
    }

    const perfilBt = () => {
        let name = user.name ? user.name.split(' ')[0] : ' '
        let button = isPc ?
            (
                <button id="perfilBt" onClick={() => toggleDropdown()} type="button" className={"btn btn-warning " + style.BtContent}>
                    { name[0] ? name[0].toUpperCase() + name.substring(1) : null}
                </button>
            ) : (
                <button id="perfilBt" onClick={() => toggleDropdown()} type="button" className={"btn btn-warning " + style.BtContent}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                    </svg>
                </button>
            )

        return user.name ? (
            <div className={style.PerfilDropdown}>
                <div className={style.DropdownButton}>
                    { button }
                    <button id="toggleBt" type="button" onClick={() => toggleDropdown()} className={"btn btn-warning dropdown-toggle " + style.BtToggler}></button>
                </div>
                { open && (<div id='dropdown' className={style.DropdownContent}>
                    <button id="painelBt" onClick={() => Router.push('/painel')} className={ style.DropdownItem } type="button">Painel</button>
                    {user.is_admin ? <button  id="empAdminBt" onClick={() => Router.push('/painel/empreendimentos-admin')} className={ style.DropdownItem } type="button">Empreendimentos</button> : null}
                    <button id="sairBt" onClick={() => globalSignOut() } className={ style.DropdownItem } type="button">Sair</button>
                </div>)}
            </div>
        ) : null
    }
    function logoClick() {
        if (session) {
            router.push('/painel')
        } else {
            router.push('/')
        }
    }
    return (
        <div className={position}>
            <Container>
                <div className={style.Divs}>
                    <div onClick={() => logoClick()} className={style.Logo}>
                        <Image priority width={300} height={100} src={'/media/logo2.png'} alt="" />
                    </div>
                    <div className={style.Buttons}>
                        {entrarBt()}
                        {cadastrarBt()}
                        {perfilBt()}
                    </div>
                </div>
            </Container>
        </div>
    )
}
export default TopNavbar