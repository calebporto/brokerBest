import Image from 'next/image'
import style from '../styles/Painel.module.css'
import Container from './Container'
import { useContext } from 'react'
import { PremiumContext } from '@/contexts/PremiumContext'
import { Project } from '@/helpers/interfaces'
import { allFirstUppercase, firstAndParagraphUppercase } from '@/helpers/helpers'
import { useRouter } from 'next/router'


export default function Destaques() {
    const { projects, lastUpdate, premiumUpdate } = useContext(PremiumContext)
    const router = useRouter()

    if (lastUpdate && premiumUpdate) {
        premiumUpdate()
    }

    function open(project: Project) {
        router.push(`/painel/empreendimentos?id=${project.id}`)
    }

    var carouselGen = () => {
        let activeClass = ' active'
        if (projects) {
            let imgs = projects.map((project: Project, index: number) => {
                if (index > 0) activeClass = ''
                return (
                    <div key={index} onClick={() => open(project)} className={'carousel-item' + activeClass} style={{ height: '100%', cursor: 'pointer'}}>
                        <Image style={{ height: '100%', objectFit: 'cover' }} className="d-block w-100" src={project.thumb || ''} width={1200} height={724} alt='' />
                        <div className={'carousel-caption d-md-block ' + style.Legenda}>
                            <h5>{allFirstUppercase(project.name)}</h5>
                            <p>{firstAndParagraphUppercase(project.description)}</p>
                        </div>
                    </div>
                )
            })
            return imgs
        }
        return null
    }

    return (
        projects && projects.length > 0 ? (<div className={style.Destaques}>
            <div className={style.Title}>
                <Image className={style.PremiumImg} src={'/media/premium.png'} height={96} width={96} alt='' />
                <p>Premium</p>
                <Image className={style.PremiumImg} src={'/media/premium.png'} height={96} width={96} alt='' />
            </div>
            <div className={style.DivCarousel}>
                <div id="carouselExampleControls" style={{ height: '100%' }} className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner" style={{ height: '100%' }}>
                        {carouselGen()}
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
        </div>) : null
    )
}