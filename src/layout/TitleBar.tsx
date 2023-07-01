import style from '../styles/TopNavbar.module.css'
import Container from './Container'

// Usa TopNavbar.modules.css para estilizar

export default function TitleBar(props: {title: string}) {
    return (
        <div className={style.TitleBar}>
            <Container>
                <p>{ props.title }</p>
            </Container>
        </div>
    )
}