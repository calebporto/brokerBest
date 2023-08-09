import { useRouter } from 'next/router'
import style from '../styles/Initial.module.css'
import PatternBt from './PatternBt'
import { signOut } from 'next-auth/react'

const Initial = () => {
    const router = useRouter()
    return (
        <div className={style.Initial}>
            <div className={style.Text}>
                <p className={style.Title}>A FERRAMENTA QUE VOCÊ PRECISA PARA DECOLAR!</p>
                <PatternBt name="Assine gratuitamente" clickAction={() => router.push('/entrar')}></PatternBt>

            </div>
        </div>
    )
}
export default Initial