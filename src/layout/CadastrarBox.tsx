import Link from "next/link"
import style from "../styles/Entrar.module.css"
import Image from "next/image"
import Alert from "./Alert"
import { useState } from "react"
import Router from "next/router"

const CadastrarBox = () => {
    return (
        <div id="loginBox" className={style.LoginBox}>
            <Alert message={alertMessage} type={"danger"} show={alertShow} handleShow={setAlertShow} />
            <div className={style.Title}>
                <p>Login</p>
            </div>
            <div className={style.Inputs}>
                <div className={style.Input}>
                    <input type="text" id="email" placeholder="E-mail" maxLength={50}/>
                </div>
                <div className={style.Input}>
                    <input type="text" id="password" placeholder="Senha" maxLength={50}/>
                </div>
                <div className={style.Button}>
                    <button>Entrar</button>
                </div>
                <div className={style.EsqueciSenha}>
                    <Link href={'#'}>
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
        </div>
    )
}