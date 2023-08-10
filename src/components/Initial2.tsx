import PatternBt from './PatternBt'
import style from '../styles/Initial2.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

const Initial = () => {
    const { windowDimensions } = useContext(AuthContext)
    const [isBigWindow, setIsBigWindow] = useState(true)
    const router = useRouter()
    useEffect(() =>{
        if (windowDimensions.width && windowDimensions.width > 915) {
            if (!isBigWindow) {
                setIsBigWindow(true)
            }
        } else {
            if (isBigWindow) {
                setIsBigWindow(false)
            }
        }
    }, [windowDimensions])
    return (
        <div className={style.Initial2}>
            <div className={style.Text}>
                <p className={style.Title}>A CAIXA DE PANDORA FOI ABERTA!</p>
                { !isBigWindow && <div className={style.Image}>
                    <Image priority width={500} height={500} src={'/media/homem2.png'} alt='' />
                </div>}
                <p className={style.Content}>
                Começar no mercado imobiliário é uma tarefa árdua, pois a dificuldade para absorver
                a grande quantidade de informações é enorme, e a maioria tende a ficar pelo caminho.<br></br>
                Durante o tempo que estou no ramo, aprendi que, por mais que eu tente, É IMPOSSÍVEL 
                SABER TUDO!
                <br></br>
                Sabendo disso, uma das coisas que eu mais me dediquei foi em reunir todos os dados à
                disposição em um só lugar, de fácil consulta e ao mesmo tempo com enorme valor,
                que me tornasse possível encontrar os empreendimentos mais relevantes com extrema agilidade.
                Isso fez com que eu chegasse de forma muito rápida nas melhores oportunidades.
                <br /><br />
                O resultado?
                </p>
                <p className={style.ContentTitle}>
                    + DE 20 MILHÕES EM VENDAS!
                </p>
                <p className={style.Content}>
                Diante desse excelente resultado, resolvi disponibilizar o meu método para você em uma 
                plataforma moderna e poderosa, <strong>GRATUITAMENTE</strong>, ajudando os corretores a 
                alcançarem resultados excelentes através do poder da tecnologia.
                </p>
                <PatternBt addClass={'MarginZero'} clickAction={() => router.push('/entrar')} name="Vamos começar!"></PatternBt>
            </div>
            {isBigWindow && <div className={style.Image}>
                <Image priority width={500} height={500} src={'/media/homem2.png'} alt=''/>
            </div>}
        </div>
    )
}
export default Initial