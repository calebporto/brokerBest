import style from "../styles/AuthEmail.module.css"
import { useSession } from "next-auth/react"
import { useContext, useState } from "react"
import Router from "next/router"
import Alert, { _throwAlert } from "./Alert"
import { AuthContext } from "@/contexts/AuthContext"


const AuthEmailBox = () => {
    const { session, update } = useContext(AuthContext)
    const [showPage, setShowPage] = useState(false)
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    const [alertClick, setAlertClick] = useState('')
    function throwAlert(message:string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }
    function newAuthEmail() {
        fetch('/api/auth/new-auth-email',{
            headers: {
                'authorization': process.env.NEXT_PUBLIC_API_TOKEN as string
            }
        })
        .then(response => response.json())
        .then(resp => {
            throwAlert('Enviamos um novo e-mail para você. Confira sua caixa de entrada.', 'success')
            let now = new Date()
            let lastEmailExp = now.getTime() + (1 * 60000)
            let newLastEmailExp = new Date(lastEmailExp).toISOString()
            update({last_email_exp: newLastEmailExp})
            return
        })
    }
    if (session === undefined) {
        return null
    } else if (session == null) {
        Router.push('/entrar')
    } else {
        if (session.user.is_authenticated) {
            Router.push('/painel')
        } else {
            if (!showPage) {
                let last_email_exp = new Date(session.user.last_email_exp)
                let dateNow = new Date()
                if (dateNow.getTime() > last_email_exp.getTime()) {
                    newAuthEmail()
                }
                setShowPage(true)
            }
        }
    }

    return (
        showPage ? <>
        <div className={style.AuthEmailBox}>
            <Alert message={alertMessage} type={alertType} show={alertShow} handleShow={setAlertShow} clickAction={alertClick} />
            <div className={style.Title}>
                <p>Confirme seu e-mail</p>
            </div>
            <p className={style.Content}>
                Para a sua segurança, enviamos um e-mail de autenticação para você. Siga as instruções
                contidas nele para acessar a sua conta.
            </p>
            <p className={style.Content}>
                Caso não tenha recebido o e-mail, <a className={style.NovoEmail} onClick={() => newAuthEmail()}>clique aqui</a> para enviar um novo e-mail.
            </p>
        </div>
        </> : null
    )
}
export default AuthEmailBox