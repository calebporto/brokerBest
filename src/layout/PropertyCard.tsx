import { AuthContext } from "@/contexts/AuthContext"
import { allFirstUppercase, windowOpen } from "@/helpers/helpers"
import Image from "next/image"
import { useRouter } from "next/router"
import { MouseEvent, useContext, useEffect, useState } from "react"
import style from '../styles/ProjectCard.module.css'
import { Property } from "@/helpers/interfaces"
import Modal from "./Modal"
import propertyStyle from '../styles/Property.module.css'

export default function PropertyCard(props: {
    id?: number | null,
    thumb: string | null,
    name?: string | null,
    admin_id?: number | null
    propertyData: Property | null
}) {
    const context = useContext(AuthContext)
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [windowElement, setWindowElement] = useState<Window | null>(null)

    useEffect(() => {
        if (!windowElement) {
            setWindowElement(window)
        }
    }, [])

    function open(event: MouseEvent, id: number | null | undefined) {
        if (id) {
            router.push(`/painel/empreendimentos/imovel?id=${id}`)
        }
    }
    function edit(event: MouseEvent, id: number | null | undefined) {
        event.stopPropagation()
        if (id) {
            router.push(`/painel/empreendimentos/imovel/editar?id=${id}`)
        }
    }
    var carouselGen = (images: Array<string> | null | undefined) => {
        let activeClass = ' active'
        if (images) {
            let imgs = images.map((image: string, index: number) => {
                if (index > 0) activeClass = ''
                return (
                    <div key={index} className={'carousel-item' + activeClass} style={{ height: '100%', cursor: 'pointer' }}>
                        <Image onClick={() => windowOpen(windowElement, image)} style={{ height: '100%', objectFit: 'cover' }} className="d-block w-100" src={image} width={1200} height={724} alt='' />
                    </div>
                )
            })
            return imgs
        }
        return null
    }

    var videoRender = (links: Array<string> | null | undefined) => {
        if (!links) return null
        const videos = links.map((link, index) => {
            return (
                <div className={propertyStyle.Video} key={'video'+index.toString()}>
                    <iframe style={{ width: '100%', height: '100%' }} src={link} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </div>
            )
        })
        return videos
    }

    var propertyElements = () => {
        return (
            <div className={propertyStyle.Property}>
                {props.propertyData?.thumb ? (
                    <Image onClick={() => windowOpen(windowElement, props.propertyData?.thumb)} className={propertyStyle.Thumb} alt="" src={props.propertyData.thumb} width={1200} height={724}></Image>
                ) : null}
                {props.admin_id == context.user.id || context.user.is_admin ? (
                    <div className={propertyStyle.EditarBt}>
                        <button className="btn btn-warning">Editar</button>
                    </div>
                ) : null}
                <div className={propertyStyle.Description}>
                    <p className={propertyStyle.Title}>Descrição:</p>
                    <p>{props.propertyData?.description}</p>
                </div>
                <div className={propertyStyle.InfoTable}>
                    <div className={propertyStyle.Row}>
                        <div className={propertyStyle.RowTitle}>Medidas:</div>
                        <div className={propertyStyle.RowDescription}>
                            {props.propertyData?.measure}
                        </div>
                    </div>
                    <div className={propertyStyle.Row}>
                        <div className={propertyStyle.RowTitle}>Área:</div>
                        <div className={propertyStyle.RowDescription}>
                            {props.propertyData?.size}
                        </div>
                    </div>
                    <div className={propertyStyle.Row}>
                        <div className={propertyStyle.RowTitle}>Data de Entrega:</div>
                        <div className={propertyStyle.RowDescription}>
                            {props.propertyData?.delivery_date ? new Date(props.propertyData?.delivery_date as string).toLocaleDateString('pt-BR') : null}
                        </div>
                    </div>
                    <div className={propertyStyle.Row}>
                        <div className={propertyStyle.RowTitle}>Preço:</div>
                        <div className={propertyStyle.RowDescription}>
                            {props.propertyData?.price ? props.propertyData.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : null}
                        </div>
                    </div>
                    <div className={propertyStyle.Row}>
                        <div className={propertyStyle.RowTitle}>Tipo:</div>
                        <div className={propertyStyle.RowDescription}>
                            {props.propertyData?.model ? props.propertyData.model : null}
                        </div>
                    </div>
                    <div className={propertyStyle.Row}>
                        <div className={propertyStyle.RowTitle}>Status:</div>
                        <div className={propertyStyle.RowDescription}>
                            {props.propertyData?.status ? props.propertyData.status : null}
                        </div>
                    </div>
                </div>
                {props.propertyData?.images?.length as number > 0 ? (
                    <div style={{ width: '100%', marginTop: '2rem' }}>
                        <p className={propertyStyle.Title}>Imagens:</p>
                        <div className={propertyStyle.Images}>
                            <div id="carouselExampleControls" style={{ height: '100%' }} className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner" style={{ height: '100%' }}>
                                    {carouselGen(props.propertyData?.images)}
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
                ) : null}
                {props.propertyData?.videos?.length as number > 0 ? (
                    <div style={{ width: '100%', marginTop: '2rem'}}>
                        <p className={propertyStyle.Title}>Vídeos</p>
                        {videoRender(props.propertyData?.videos)}
                    </div>
                ) : null}
            </div>
        )

    }


    return (
        props.thumb ? (
                <>
                    <Modal show={showModal} setShow={setShowModal} title={allFirstUppercase(props.propertyData?.name)}>
                        {propertyElements()}
                    </Modal>
                    <div className={style.Card} onClick={() => setShowModal(true)}>
                        <div className={style.Image}>
                            <Image className={style.Img} src={props.thumb as string} width={600} height={450} alt='' />
                        </div>
                        <div className={style.Title}>
                            <p>{allFirstUppercase(props.name as string)}</p>
                        </div>
                        <div className={style.Info}>
                            {props.admin_id == context.user.id || context.user.is_admin ? (
                                <>
                                    <div className={style.EditarPropertyBt}>
                                        <button className={"btn btn-warning "} onClick={(e) => edit(e, props.id)}>
                                            Editar
                                        </button>
                                    </div>
                                </>
                            ) : null
                            }
        
                        </div>
                    </div>
                </>
            ) : null

        )
}