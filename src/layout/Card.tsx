import Image from 'next/image'
import style from '../styles/Card.module.css'

export default function Card() {
    return (
        <div className={style.Card}>
            <div className={style.Image}>
                <Image className={style.Img} src={'https://i.ibb.co/dGvcVcJ/grand-suecia.jpg'} width={400} height={600} alt=''/>
            </div>
            <div className={style.Title}>
                <p>Edifício Grand Suécia</p>
            </div>
        </div>
    )
}