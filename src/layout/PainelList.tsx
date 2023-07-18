import style from '../styles/Painel.module.css'
import Card from './ProjectCard'
import Container from './Container'

export default function PainelList() {
    return (
        <div className={style.PainelList}>
            <Container>
                <div className={style.List}>
                </div>
            </Container>
        </div>
    )
}