import TopNavbar from "@/layout/TopNavbar"
import Head from "next/head"
import style from "../styles/AuthEmail.module.css"
import AuthEmailBox from "@/layout/AuthEmailBox"

const AuthEmail = () => {
    return (
        <>
            <Head>
                <title>Broker Best</title>
                <meta name="description" content="Broker Best teste" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <TopNavbar entrarBt={false} cadastrarBt={false} perfilBt={true} fixed={false} />
            <div className={style.AuthEmail}>
                <AuthEmailBox></AuthEmailBox>
            </div>
        </>
    )
}
export default AuthEmail