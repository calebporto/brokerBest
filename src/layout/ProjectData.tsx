import Container from "./Container"
import style from '../styles/Empreendimentos.module.css'
import companyStyle from '../styles/Company.module.css'
import { ProjectView, Property } from "@/helpers/interfaces"
import { allFirstUppercase, firstAndParagraphUppercase, parseAddress, windowOpen } from "@/helpers/helpers"
import Image from 'next/image'
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import PropertyCard from "./PropertyCard"
import Modal from "./Modal"
import { useRouter } from "next/router"

export default function ProjectData(props: { project: ProjectView }) {
    const project = props.project
    const context = useContext(AuthContext)
    const { user } = context
    const router = useRouter()
    const [showCompanyModal, setShowCompanyModal] = useState(false)
    const [windowElement, setWindowElement] = useState<Window | null>(null)

    useEffect(() => {
        if (!windowElement) {
            setWindowElement(window)
        }
    }, [])
    
    function bookPdf() {
        window.open(project.project?.book)
    }
    var carouselGen = (images: Array<string> | null | undefined) => {
        let activeClass = ' active'
        if (images) {
            let imgs = images.map((image: string, index: number) => {
                if (index > 0) activeClass = ''
                return (
                    <div key={index} className={'carousel-item' + activeClass} style={{ height: '100%', cursor: 'pointer' }}>
                        <Image style={{ height: '100%', objectFit: 'cover' }} className="d-block w-100" src={image} width={1200} height={724} alt='' />
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
                <div className={style.Video} key={'video'+index.toString()}>
                    <iframe style={{ width: '100%', height: '100%' }} src={link} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </div>
            )
        })
        return videos
    }
    function propertyCardsGenerate() {
        let elements = [] as Array<JSX.Element>
        project.properties.forEach(item => {
            const Card = (
                <PropertyCard
                    key={item.id}
                    id={item.id}
                    thumb={item.thumb}
                    name={item.name}
                    admin_id={project.company?.admin_id}
                    propertyData={item}
                ></PropertyCard>
            )
            elements.push(Card)
        })
        return elements
    }
    var companyElements = () => {
        const company = project.company
        return (
            <div className={companyStyle.Company}>
                {project.company?.thumb ? (
                    <Image onClick={() => windowOpen(windowElement, project.company?.thumb)} className={companyStyle.Thumb} alt="" src={project.company.thumb} width={1200} height={724}></Image>
                ) : null}
                {company?.admin_id == user.id || user.is_admin ? (
                    <div className={companyStyle.EditarBt}>
                        <button onClick={() => router.push(`/painel/empreendimentos/construtora/editar?id=${project.company?.id}`)} className="btn btn-warning">Editar</button>
                    </div>
                ): null}
                <div className={companyStyle.Description}>
                    <p className={companyStyle.Title}>Descrição:</p>
                    <p>{firstAndParagraphUppercase(company?.description)}</p>
                </div>
                <div className={companyStyle.InfoTable}>
                    <div className={companyStyle.Row}>
                        <div className={companyStyle.RowTitle}>Nome:</div>
                        <div className={companyStyle.RowDescription}>
                            {allFirstUppercase(company?.name)}
                        </div>
                    </div>
                    <div className={companyStyle.Row}>
                        <div className={companyStyle.RowTitle}>Email:</div>
                        <div className={companyStyle.RowDescription}>
                            {company?.email}
                        </div>
                    </div>
                    <div className={companyStyle.Row}>
                        <div className={companyStyle.RowTitle}>Telefone:</div>
                        <div className={companyStyle.RowDescription}>
                            {company?.tel}
                        </div>
                    </div>
                    <div className={companyStyle.Row}>
                        <div className={companyStyle.RowTitle}>CEP:</div>
                        <div className={companyStyle.RowDescription}>
                            {company?.cep}
                        </div>
                    </div>
                    <div className={companyStyle.Row}>
                        <div className={companyStyle.RowTitle}>Endereço:</div>
                        <div className={companyStyle.RowDescription}>
                            {parseAddress(
                                company?.address,
                                company?.num,
                                company?.complement,
                                company?.district,
                                company?.city,
                                company?.uf
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ width: '100%' }}>
            <Container>
                <div className={style.Body}>
                    {project.company?.admin_id == user.id ? (
                        <div className={style.EditarBt}>
                            <button onClick={() => router.push(`/painel/empreendimentos/editar?id=${project.project?.id}`)} className="btn btn-warning">Editar Dados</button>
                        </div>
                    ) : null}
                    <div className={style.Description}>
                        <p className={style.Title}>Descrição:</p>
                        <p>{project.project?.description as string}</p>
                    </div>
                    <div className={style.InfoTable}>
                        <div className={style.Row}>
                            <div className={style.RowTitle}>Nome:</div>
                            <div className={style.RowDescription}>{allFirstUppercase(project.project?.name) as string}</div>
                        </div>
                        <div className={style.Row}>
                            <div className={style.RowTitle}>Construtora:</div>
                            <div className={style.RowDescription}>
                                <Modal show={showCompanyModal} setShow={setShowCompanyModal} title={allFirstUppercase(project.company?.name)}>
                                    {companyElements()}
                                </Modal>
                                <button onClick={() => setShowCompanyModal(true)} className="btn btn-dark">{allFirstUppercase(project.company?.name)}</button>
                            </div>
                        </div>
                        <div className={style.Row}>
                            <div className={style.RowTitle}>Data de Entrega:</div>
                            <div className={style.RowDescription}>
                                {project.project?.delivery_date ? new Date(project.project?.delivery_date as Date).toLocaleDateString('pt-BR') : null}
                            </div>
                        </div>
                        <div className={style.Row}>
                            <div className={style.RowTitle}>Endereço:</div>
                            <div className={style.RowDescription}>
                                {firstAndParagraphUppercase(parseAddress(
                                    project.project?.address,
                                    project.project?.num,
                                    project.project?.complement,
                                    project.project?.district,
                                    project.project?.city,
                                    project.project?.uf,
                                ))}
                            </div>
                        </div>
                        <div className={style.Row}>
                            <div className={style.RowTitle}>Zona:</div>
                            <div className={style.RowDescription}>
                                {allFirstUppercase(project.project?.zone)}
                            </div>
                        </div>
                        <div className={style.Row}>
                            <div className={style.RowTitle}>CEP:</div>
                            <div className={style.RowDescription}>
                                {project.project?.cep}
                            </div>
                        </div>
                        <div className={style.Row}>
                            <div className={style.RowTitle}>Status:</div>
                            <div className={style.RowDescription}>
                                {project.project?.status}
                            </div>
                        </div>
                        <div className={style.Row}>
                            <div className={style.RowTitle}>Book PDF:</div>
                            <div className={style.RowDescription}>
                                <button onClick={() => bookPdf()} className="btn btn-dark">Download</button>
                            </div>
                        </div>
                        <div className={style.Row}>
                            <div className={style.RowTitle}>Drive da Construtora:</div>
                            <div className={style.RowDescription}>
                                <button onClick={() => windowOpen(windowElement, project.project?.link)} className="btn btn-dark">Abrir</button>
                            </div>
                        </div>
                    </div>
                    {project.project && project.project?.images?.length as number > 0 ? (
                        <div style={{ width: '100%', marginTop: '2rem' }}>
                            <p className={style.Title}>Imagens:</p>
                            <div className={style.Images}>
                                <div id="carouselExampleControls" style={{ height: '100%' }} className="carousel slide" data-bs-ride="carousel">
                                    <div className="carousel-inner" style={{ height: '100%' }}>
                                        {carouselGen(project.project?.images)}
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
                    {project.project && project.project?.videos?.length as number > 0 ? (
                        <div style={{ width: '100%' }}>
                            <p className={style.Title}>Vídeos</p>
                            {videoRender(project.project?.videos)}
                        </div>
                    ) : null}
                        <div style={{ width: '100%', margin: '2rem 0' }}>
                            <p className={style.Title}>Imóveis</p>
                            {project.company && project.company?.admin_id == user.id || user.is_admin ? (
                                <div className={style.EditarBt}>
                                    <button onClick={() => router.push(`/painel/empreendimentos/adicionar-imovel?empreendimentoId=${project.project?.id}`)} className="btn btn-warning">Adicionar Imóvel</button>
                                </div>
                            ) : null}
                            {project.properties && project.properties.length > 0 ? (
                                <div className={style.Properties}>
                                    {[...propertyCardsGenerate()]}
                                </div>
                            ) : null}
                        </div>
                </div>
            </Container>
        </div>
    )
}