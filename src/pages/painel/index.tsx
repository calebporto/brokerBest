import { AuthContext } from "@/contexts/AuthContext"
import Destaques from "@/layout/Destaques"
import DriveBar from "@/layout/DriveBar"
import FiltroBar from "@/layout/FiltroBar"
import Footer from "@/layout/Footer"
import PainelList from "@/layout/PainelList"
import TitleBar from "@/layout/TitleBar"
import TopNavbar from "@/layout/TopNavbar"
import { useSession } from "next-auth/react"
import Head from "next/head"
import Router, { useRouter } from "next/router"
import { useContext, useState } from "react"

const carouselImgs = [
    'https://i.ibb.co/7rV5YpW/GYM-E-KIDS-CAM3.jpg',
    'https://i.ibb.co/f1ZjYt0/SPA-E-SAUNA-2-1.jpg',
    'https://i.ibb.co/YdZgHSW/SALAO-DE-FESTAS-VISTA-2-pos.jpg',
    'https://i.ibb.co/DYrpvh1/SALA-3-QUARTOS-06.jpg',
    'https://i.ibb.co/26dmSMr/TRUST-FACHADA-frente-detalhe.jpg'
]

const PainelPage = () => {
    const [showPage, setShowPage] = useState(false)
    const context = useContext(AuthContext)
    const { user, session } = context

    if (session === undefined) return
    if (session == null) {
        Router.push('/entrar')
    } else if (!session.user.is_authenticated) {
        Router.push('/entrar/auth-email')
    } else if (!user.is_complete_data) {
        Router.push('/auth/login-social')
    } else {
        if (!showPage) {
            setShowPage(true)
        }
    }
    return (
        showPage ?
        <>
            <Head>
                <title>Broker Best</title>
                <meta name="description" content="Broker Best teste" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <TopNavbar perfilBt={true} contextUser={context}/>
            <TitleBar title='Painel do Corretor' />
            <Destaques imgs={carouselImgs} />
            {/* <FiltroBar /> */}
            <DriveBar />
            <PainelList/>
            <Footer></Footer>
        </> : null
    )
}
export default PainelPage