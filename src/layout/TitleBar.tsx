import style from '../styles/TopNavbar.module.css'
import Container from './Container'

// Usa TopNavbar.modules.css para estilizar

export default function TitleBar(props: {title: string | null | undefined}) {
    return (
        <div className={style.TitleBar}>
            <Container>
                <p>{ props.title || null }</p>
            </Container>
        </div>
    )
}