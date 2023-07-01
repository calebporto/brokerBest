import style from '../styles/DriveBar.module.css'
import Container from './Container'

export default () => {
    return (
        <div style={{width: '100%', display: 'flex', height: 'auto'}}>
            <Container>
                <div className={style.DriveBar}>
                    <p className={style.Title}>
                        Drive Imobiliário
                    </p>
                </div>
            </Container>
        </div>
    )
}