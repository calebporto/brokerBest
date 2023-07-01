import Image from 'next/image'
import style from '../styles/Painel.module.css'
import Container from './Container'


export default function Destaques(props: { imgs: Array<string> }) {
    var carouselGen = (carouselImgs: Array<string>) => {
        let activeClass = ' active'
        let imgs = carouselImgs.map((img: string, index: number) => {
            if (index > 0) activeClass = ''
            return (
                <div key={index} className={'carousel-item' + activeClass} style={{ height: '100%', position: 'relative' }}>
                    <Image style={{ height: '100%', objectFit: 'cover' }} className="d-block w-100" src={img} width={1200} height={724} alt='' />
                    <div className={'carousel-caption d-md-block ' + style.Legenda}>
                        <h5>First slide label</h5>
                        <p>Some representative placeholder content for the first slide.</p>
                    </div>
                </div>
            )
        })
        return imgs
    }

    return (
        <div className={style.Destaques}>
            <div className={style.Title}>
                <Image className={style.PremiumImg} src={'/media/premium.png'} height={96} width={96} alt='' />
                <p>Premium</p>
                <Image className={style.PremiumImg} src={'/media/premium.png'} height={96} width={96} alt='' />
            </div>
            <div className={style.DivCarousel}>
                <div id="carouselExampleControls" style={{ height: '100%' }} className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner" style={{ height: '100%' }}>
                        {...carouselGen(props.imgs)}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Anterior</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Próximo</span>
                    </button>
                </div>
            </div>
        </div>
    )
}