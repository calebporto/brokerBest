import { AuthContext } from "@/contexts/AuthContext"
import { PremiumContext } from "@/contexts/PremiumContext"
import Alert, { _throwAlert } from "@/layout/Alert"
import Destaques from "@/layout/Destaques"
import DriveBar from "@/layout/DriveBar"
import Footer from "@/layout/Footer"
import TitleBar from "@/layout/TitleBar"
import TopNavbar from "@/layout/TopNavbar"
import Head from "next/head"
import Router, { useRouter } from "next/router"
import { useContext, useState } from "react"


const PainelPage = () => {
    const [showPage, setShowPage] = useState(false)
    const context = useContext(AuthContext)
    const premiumContext = useContext(PremiumContext)
    const { user, session, systemMessage } = context
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    
    function throwAlert(message:string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }

    if (session === undefined) return
    if (session == null) {
        Router.push('/entrar')
    } else if (!session.user.is_authenticated) {
        Router.push('/entrar/auth-email')
    } else if (user.is_complete_data == false) {
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
            <Alert message={alertMessage} setMessage={setAlertMessage} type={alertType} show={alertShow} handleShow={setAlertShow} showSystemMessage={true}></Alert>
            <Destaques/>
            {/* <FiltroBar /> */}
            {/* <PainelList/> */}
            <DriveBar />
            <Footer></Footer>
        </> : null
    )
}
export default PainelPage