import Link from "next/link"
import style from "../styles/Entrar.module.css"
import Image from "next/image"
import Alert, { _throwAlert } from "./Alert"
import { useContext, useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import Router from "next/router"
import { AuthContext } from "@/contexts/AuthContext"



const LoginBox = () => {
    const { loginRequire, systemMessage } = useContext(AuthContext)
    const [showPage, setShowPage] = useState(false)
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    const { data: session } = useSession() as any
    function throwAlert(message:string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }
    function emailValidator(emailElement: HTMLInputElement) {
        let value = emailElement.value
        if (!value || value.indexOf('@') == -1 || value.length < 7) {
            setAlertMessage('E-mail Inválido.')
            setAlertShow(true)
            return false
        } else {
            setAlertShow(false)
            return true
        }
    }
    function passwordValidator(passwordElement: HTMLInputElement) {
        let value = passwordElement.value
        if (!value || value.length < 8) {
            setAlertMessage('Senha inválida.')
            setAlertShow(true)
            return false
        } else {
            setAlertShow(false)
            return true
        }
    }
    async function emailLogin() {
        var email = document.querySelector('#email') as HTMLInputElement
        var password = document.querySelector('#password') as HTMLInputElement
        var loginBt = document.getElementById('loginBt') as HTMLButtonElement
        if (!emailValidator(email)) {
            return
        }
        if (!passwordValidator(password)) {
            return
        }
        loginBt.innerHTML = `
        <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        `
        var response = await signIn('credentials', {
            redirect: false,
            callbackUrl: process.env.NEXTAUTH_URL,
            email: email.value, 
            password: password.value,
            authorization: process.env.NEXT_PUBLIC_API_TOKEN as string
        }) as any
        if (response.status == 401) {
            loginBt.innerHTML = 'Entrar'
            throwAlert('Usuário ou senha inválidos.', 'danger')
            return
        }
        Router.push('/painel')
    }
    function googleLogin() {
        signIn('google', {callbackUrl: '/auth/login-social'})
    }
    function facebookLogin() {
        signIn('facebook', {callbackUrl: '/auth/login-social'})
    }
    
    if (session === undefined) {
        return null
    } else if (session == null) {
        if (!showPage) {
            setShowPage(true)
        }
    } else {
        if (!session.user.is_authenticated) {
            Router.push('/entrar/auth-email')
        } else{
            Router.push('/painel')
        }
    }
    if (loginRequire) {
        loginRequire(true)
    }
    
    return (
        showPage ? <div id="loginBox" className={style.LoginBox}>
            <Alert message={alertMessage} setMessage={setAlertMessage} type={alertType} show={alertShow} handleShow={setAlertShow} showSystemMessage={true}/>
            <div className={style.Title}>
                <p>Login</p>
            </div>
            <div className={style.Inputs}>
                <div className={style.Input}>
                    <input type="text" id="email" placeholder="E-mail" maxLength={50}/>
                </div>
                <div className={style.Input}>
                    <input type="password" id="password" placeholder="Senha" maxLength={50}/>
                </div>
                <div className={style.Button}>
                    <button id={'loginBt'} onClick={() => emailLogin()}>Entrar</button>
                </div>
                <div className={style.EsqueciSenha}>
                    <Link href={'/entrar/forgot-password'}>
                        Esqueceu a senha?
                    </Link>
                </div>
                <div className={style.Divider}>ou</div>
            </div>
            <div className={style.Alternatives}>
                <div className={`${style.Google} ${style.Alternative}`} onClick={() => googleLogin()}>
                    <Image src={'/media/google.png'} width={150} height={150} alt="" />
                </div>
                <div className={`${style.Facebook} ${style.Alternative}`} onClick={() => facebookLogin()}>
                    <Image src={'/media/facebook.png'} width={150} height={150} alt="" />
                </div>
            </div>
            <button onClick={() => signOut()}></button>
        </div> : null
    )
}
export default LoginBox