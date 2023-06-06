import Link from "next/link"
import style from "../styles/AuthEmail.module.css"

const AuthEmailBox = () => {
    return (
        <>
        <div className={style.AuthEmailBox}>
            <div className={style.Title}>
                <p>Confirme seu e-mail</p>
            </div>
            <p className={style.Content}>
                Para a sua segurança, enviamos um e-mail de autenticação para você. Siga as instruções
                contidas nele para acessar a sua conta.
            </p>
            <p className={style.Content}>
                Caso não tenha recebido o e-mail, <a className={style.NovoEmail} onClick={() => console.log('ok')}>clique aqui</a> para enviar um novo e-mail.
            </p>
        </div>
        </>
    )
}
export default AuthEmailBox