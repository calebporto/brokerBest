import style from '../styles/Painel.module.css'
import Card from './Card'
import Container from './Container'

export default function PainelList() {
    return (
        <div className={style.PainelList}>
            <Container>
                <div className={style.List}>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                </div>
            </Container>
        </div>
    )
}