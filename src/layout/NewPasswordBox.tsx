import { useSession } from "next-auth/react"
import Router, { useRouter } from "next/router"
import { useState } from "react"
import style from '../styles/NewPassword.module.css'
import Alert, { _throwAlert } from "./Alert"

const NewPasswordBox = () => {
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    const [alertAction, setAlertAction] = useState('')
    const router = useRouter()
    const { data: session } = useSession() as any
    const [showPage, setShowPage] = useState(false)
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    
    function throwAlert(message:string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }

    function sendNewPassword() {
        setAlertShow(false)
        setAlertAction('')
        if (!password || !password2) {
            throwAlert('Verifique a digitação.', 'danger')
            return
        }
        if (password != password2) {
            throwAlert('As senhas não conferem.', 'danger')
            return
        }
        const token = router.query.token
        if (!token) {
            throwAlert('Credenciais inválidas.', 'danger')
            return
        }

        const body = {
            password: password,
            token: token
        }
        fetch('/api/auth/new-password-validate', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'authorization': process.env.NEXT_PUBLIC_API_TOKEN as string
            }
        })
        .then(response => {
            if (response.status == 200) {
                throwAlert('Senha alterada com sucesso. Clique aqui para entrar.', 'success')
                setAlertAction('/entrar')
                setPassword('')
                setPassword2('')
            } else if (response.status == 461 || response.status == 462) {
                throwAlert('Credenciais inválidas', 'danger')
                setPassword('')
                setPassword2('')
            } else if (response.status == 460) {
                throwAlert('O link expirou. Clique aqui para enviar um novo link.', 'warning')
                setAlertAction('/entrar/forgot-password')
                setPassword('')
                setPassword2('')
            } else {
                throwAlert('Erro no servidor. Tente novamente mais tarde', 'danger')
                setPassword('')
                setPassword2('')
            }
        })
    }
    
    if (session === undefined) {
        return null
    } else if (session == null) {
        if (!showPage) {
            setShowPage(true)
        }
    } else {
        if (session.user.is_authenticated) {
            Router.push('/painel')
        } else {
            Router.push('/entrar/auth-email')
        }
    }

    return (
        <>
        <div className={style.Box}>
            <Alert message={alertMessage} type={alertType} show={alertShow} handleShow={setAlertShow} clickAction={alertAction}/>
            <div className={style.Title}>
                <p>Redefinir Senha</p>
            </div>
            <div className={style.Inputs}>
                <div className={style.Input}>
                    <input type="password" placeholder="Escolha uma nova senha" id="password" maxLength={50}
                    value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className={style.Input}>
                    <input type="password" placeholder="Confirme a senha" id="password2" maxLength={50} 
                    value={password2} onChange={(e) => setPassword2(e.target.value)}/>
                </div>
            </div>
            <div className={style.Button}>
                <button id="sendBt" onClick={() => sendNewPassword()}>Enviar</button>
            </div>
        </div>
        </>
    )
}
export default NewPasswordBox