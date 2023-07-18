import { AuthContext } from "@/contexts/AuthContext"
import NewPasswordBox from "@/layout/NewPasswordBox"
import TopNavbar from "@/layout/TopNavbar"
import style from '@/styles/NewPassword.module.css'
import Head from "next/head"
import { useContext } from "react"

export default function NewPassAuth() {
    const context = useContext(AuthContext)    
    return (
        <>
        <Head>
            <title>Broker Best</title>
            <meta name="description" content="Broker Best teste" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <TopNavbar contextUser={context} entrarBt={true} cadastrarBt={true} perfilBt={false} fixed={false}/>
        <div className={style.Body}>
            <NewPasswordBox></NewPasswordBox>
        </div>
        </>
    )
}