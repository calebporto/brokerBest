import style from '../styles/FiltroBar.module.css'
import Container from './Container'

export default function FiltroBar() {
    return (
        <div className={style.FiltroBar}>
            <Container>
                <div className={style.Body}>
                    <div className={style.Buttons}>
                        <button id='addFiltroBt' className='btn btn-warning'>Adicionar Filtro</button>
                        <button id='ordenarBt' className='btn btn-dark'>Ordenar por</button>
                    </div>
                    <div className={style.Filtros}>
                        <div className={style.FiltrosDisplay}></div>
                    </div>
                </div>
            </Container>
        </div>
    )
}