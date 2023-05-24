import style from '../styles/Initial.module.css'
import PatternBt from './PatternBt'
import { signOut } from 'next-auth/react'

const Initial = () => {
    
    return (
        <div className={style.Initial}>
            <div className={style.Text}>
                <p className={style.Title}>A FERRAMENTA QUE VOCÊ PRECISA PARA DECOLAR</p>
                <p className={style.Content}>
                    Chega de ficar perdendo horas procurando empreendimentos por todo lugar!
                    <br />
                    Valorize o seu tempo, usando a plataforma que reúne os melhores empreendimentos da região em
                    um só lugar.
                </p>
                <PatternBt name="Assine agora" clickAction={signOut}></PatternBt>

            </div>
        </div>
    )
}
export default Initial