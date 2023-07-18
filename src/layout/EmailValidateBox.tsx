import style from '@/styles/EmailValidate.module.css'
import Alert, { _throwAlert } from './Alert'
import Spinner from './Spinner'
import { useSession } from 'next-auth/react'
import { useContext, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { AuthContext } from '@/contexts/AuthContext'


export default function EmailValidateBox() {
    const { session, update } = useContext(AuthContext)
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    const [alertClick, setAlertClick] = useState('')
    const [spinnerShow, setSpinnerShow] = useState(true)
    const [showPage, setShowPage] = useState(true)
    function throwAlert(message:string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }
    const router = useRouter()
    const sendToken = (token: string) => {
        let send = {token: token}
        fetch(`/api/auth/email-validate`, {
            method: 'POST',
            body: JSON.stringify(send),
            headers: {
                'authorization': process.env.NEXT_PUBLIC_API_TOKEN as string
            }
        })
        .then(response => {
            if (response.ok) {
                setShowPage(false)
                update({is_authenticated: true})
                Router.push('/painel')
            } else {
                setSpinnerShow(false)
                throwAlert('O código expirou. Clique aqui para gerar um novo código.', 'danger')
                setAlertClick('/entrar/auth-email')
            }
        })
    }

    if (session === undefined) {
        return null
    } else if (session == null) {
        if (showPage) {
            throwAlert('Você não tem uma sessão de usuário ativa. Clique aqui para fazer login.', 'danger')
            setAlertClick('/entrar')
            setSpinnerShow(false)
        }
    } else {
        if (showPage) {
            if (session.user.is_authenticated) {
                Router.push('/painel')
            } else {
                sendToken(router.query.token as string)
            }
        }
    }
    return (
        showPage ? <>
            <div className={style.Box}>
                <Alert message={alertMessage} type={alertType} show={alertShow} handleShow={setAlertShow} clickAction={alertClick} />
                <Spinner show={spinnerShow} color='dark' is_short={false} />
            </div>
        </> : null
    )
}