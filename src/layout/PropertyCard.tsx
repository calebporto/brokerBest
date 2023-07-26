import { AuthContext } from "@/contexts/AuthContext"
import { allFirstUppercase, firstAndParagraphUppercase, windowOpen } from "@/helpers/helpers"
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
    const { setSystemMessage } = context
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [windowElement, setWindowElement] = useState<Window | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

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
    async function ppDelete(e: MouseEvent, id: number | null | undefined) {
        e.stopPropagation()
        if (id) {
            const deleteProperty = await fetch(`/api/projects/property-delete?id=${id}`).then(response => {
                if (!response.ok) return false
                else return true
            })
            if (deleteProperty) {
                router.reload()
            } else {
                setSystemMessage(`Algo deu errado. Tente novamente mais tarde.`)
                setShowModal(false)
                return
            }
        }
    }
    var carouselGen = (images: Array<string> | null | undefined) => {
        let activeClass = ' active'
        if (images) {
            let imgs = images.map((image: string, index: number) => {
                if (index > 0) activeClass = ''
                return (
                    <div key={'propertyImgs' + index.toString()} className={'carousel-item' + activeClass} style={{ height: '100%', cursor: 'pointer' }}>
                        <Image priority onClick={() => windowOpen(windowElement, image)} style={{ height: '100%', objectFit: 'cover' }} className="d-block w-100" src={image} width={1200} height={724} alt='' />
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
                <div className={propertyStyle.Video} key={'video' + index.toString()}>
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
                    <Image priority onClick={() => windowOpen(windowElement, props.propertyData?.thumb)} className={propertyStyle.Thumb} alt="" src={props.propertyData.thumb} width={1200} height={724}></Image>
                ) : null}
                {/* {props.admin_id == context.user.id || context.user.is_admin ? (
                    <div className={propertyStyle.EditarBt}>
                        <button className="btn btn-warning">Editar</button>
                    </div>
                ) : null} */}
                <div className={propertyStyle.Description}>
                    <p className={propertyStyle.Title}>Descrição:</p>
                    <p>{firstAndParagraphUppercase(props.propertyData?.description)}</p>
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
                            {props.propertyData?.size ? props.propertyData?.size?.toString().replace('.', ',') : null}
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
                            {props.propertyData?.status ? allFirstUppercase(props.propertyData.status) : null}
                        </div>
                    </div>
                </div>
                {props.propertyData?.images?.length as number > 0 ? (
                    <div style={{ width: '100%', marginTop: '2rem' }}>
                        <p className={propertyStyle.Title}>Imagens:</p>
                        <div className={propertyStyle.Images}>
                            <div id="carouselExampleControlsProperty" style={{ height: '100%' }} className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner" style={{ height: '100%' }}>
                                    {carouselGen(props.propertyData?.images)}
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControlsProperty" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Anterior</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControlsProperty" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Próximo</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
                {props.propertyData?.videos?.length as number > 0 ? (
                    <div style={{ width: '100%', marginTop: '2rem' }}>
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
                        <Image priority className={style.Img} src={props.thumb as string} width={600} height={450} alt='' />
                    </div>
                    <div className={style.Title}>
                        <p>{allFirstUppercase(props.name as string)}</p>
                    </div>
                    <div className={style.Info}>
                        {/* {props.admin_id == context.user.id || */context.user.is_admin ? (
                            <>
                                {/* <div className={style.EditarPropertyBt}>
                                    <button className={"btn btn-warning "} onClick={(e) => edit(e, props.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{ margin: 'auto' }} fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                        </svg>
                                    </button>
                                </div> */}
                                <Modal show={showDeleteModal} setShow={setShowDeleteModal} title={'Tem certeza?'} shortModal={true}>
                                    <p>Essa ação é definitiva.</p>
                                    <div className={style.ConfirmarModalBt}>
                                        <button onClick={(e) => ppDelete(e, props.id) } className="btn btn-danger">Excluir</button>
                                    </div>
                                </Modal>
                                <div className={style.EditarPropertyBt}>
                                    <button className={"btn btn-warning "} onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true)}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                        </svg>
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