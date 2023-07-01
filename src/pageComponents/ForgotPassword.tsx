import ForgotPasswordBox from "@/layout/ForgotPasswordBox"
import TopNavbar from "@/layout/TopNavbar"
import Head from "next/head"
import style from '../styles/ForgotPassword.module.css'
import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { checkContextUpdate } from "@/helpers/helpers"

const ForgotPassword = () => {
    const { ...context } = useContext(AuthContext)
    if (context.user.lastUpdate) {
        checkContextUpdate(context)
    }

    return (
        <>
            <Head>
                <title>Broker Best</title>
                <meta name="description" content="Broker Best teste" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <TopNavbar entrarBt={true} cadastrarBt={true} perfilBt={false} fixed={false} contextUser={context}/>
            <div className={style.Body}>
                <ForgotPasswordBox></ForgotPasswordBox>
            </div>
        </>
    )
}
export default ForgotPassword