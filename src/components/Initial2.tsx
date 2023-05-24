import PatternBt from './PatternBt'
import style from '../styles/Initial2.module.css'
import Image from 'next/image'
import { Modal } from 'bootstrap'
import { useEffect } from 'react'

const Initial = () => {
    return (
        <div className={style.Initial2}>
            <div className={style.Text}>
                <p className={style.Title}>A CAIXA DE PANDORA FOI ABERTA!</p>
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
                    + DE 9 MILHÕES EM VENDAS!
                </p>
                <p className={style.Content}>
                Diante desse excelente resultado, resolvi disponibilizar o meu método para você em uma <strong>plataforma
                moderna e poderosa</strong>, por um valor simbólico que nos permita manter os custos de desenvolvimento e 
                manutenção, ajudando os corretores a alcançarem resultados excelentes através do poder da tecnologia.
                </p>
                <p className={style.ContentTitle}>Bora virar meu sócio?</p>
                <PatternBt name="Quero ser sócio"></PatternBt>
            </div>
            <div className={style.Image}>
                <Image width={600} height={600} src={'/media/homem2.png'} alt=''/>
            </div>
        </div>
    )
}
export default Initial