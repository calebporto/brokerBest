import { useEffect, useRef, useState } from 'react'
import style from '../styles/ForgotPassword.module.css'
import Alert, { _throwAlert } from './Alert'
import { useSession } from 'next-auth/react'
import Router from 'next/router'

export default function ForgotPassword() {
    const [showPage, setShowPage] = useState(false)
    const [input, setInput] = useState('')
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    const [alertClick, setAlertClick] = useState('')
    const { data: session } = useSession() as any
    
    function throwAlert(message:string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }

    function sendEmail() {
        if (!input || input.indexOf('@') == -1 || input.length < 7) {
            throwAlert('E-mail inválido.', 'danger')
            return
        }
        
        var sendBt = document.getElementById('sendBt') as HTMLButtonElement
        sendBt.innerHTML = `
        <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        `
        setAlertShow(false)

        fetch('/api/auth/new-password', {
            method: 'POST',
            body: JSON.stringify({email: input}),
            headers: {authorization: process.env.NEXT_PUBLIC_API_TOKEN as string}
        })
        .then(response => {
            if (response.ok) {
                throwAlert('Enviamos um e-mail para você. Para redefinir sua senha, siga as\
                instruções contidas nesse e-mail.', 'success')
                sendBt.innerHTML = 'Enviar'
            }
            else {
                if (response.status == 460) {
                    throwAlert('Você possui um acesso via Google. Clique aqui para fazer login', 'danger')
                    setAlertClick('/entrar')
                } else if (response.status == 461) {
                    throwAlert('Você possui um acesso via Facebook. Clique aqui para fazer login', 'danger')
                    setAlertClick('/entrar')
                } else if (response.status == 404) {
                    throwAlert('E-mail inválido', 'danger')
                } else {
                    throwAlert('Erro no servidor. Tente novamente mais tarde.', 'danger')
                }
                sendBt.innerHTML = 'Enviar'
            } 
        })
        
    }

    if (session === undefined) {
        return null
    } else if (session == null) {
        if (!showPage) {
            setShowPage(true)
        }
    } else{
        if (!session.user.is_authenticated) {
            Router.push('/entrar/auth-email')
        } else{
            Router.push('/painel')
        }
    }
    
    return (
        showPage ? <>
        <div className={style.Box}>
            <Alert message={alertMessage} type={alertType} show={alertShow} handleShow={setAlertShow} clickAction={alertClick} />
            <div className={style.Title}>
                <p>Recuperar Senha</p>
            </div>
            <div className={style.Input}>
                <p>Digite o seu e-mail cadastrado:</p>
                <input value={input} id='email' placeholder='E-mail' onChange={(e) => setInput(e.target.value)} type="text" />
            </div>
            <div className={style.Button}>
                <button id='sendBt' onClick={() => sendEmail()}>Enviar</button>
            </div>
        </div>
        </> : null
    )
}