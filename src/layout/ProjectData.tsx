import Container from "./Container"
import style from '../styles/Empreendimentos.module.css'
import { ProjectView } from "@/helpers/interfaces"
import { allFirstUppercase, firstAndParagraphUppercase, parseAddress } from "@/helpers/helpers"
import Image from 'next/image'

export default (props: {project: ProjectView}) => {
    const project = props.project
    
    function bookPdf() {
        window.open(project.project?.book)
    }
    var carouselGen = (images: Array<string> | null | undefined) => {
        let activeClass = ' active'
        if (images) {
            let imgs = images.map((image: string, index: number) => {
                if (index > 0) activeClass = ''
                return (
                    <div key={index} className={'carousel-item' + activeClass} style={{ height: '100%', cursor: 'pointer'}}>
                        <Image style={{ height: '100%', objectFit: 'cover' }} className="d-block w-100" src={image} width={1200} height={724} alt='' />
                    </div>
                )
            })
            return imgs
        }
        return null
    }

    return (
        <div style={{width: '100%'}}>
            <Container>
                <div className={style.Body}>
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
                                <button className="btn btn-dark">{allFirstUppercase(project.cp_name)}</button>
                            </div>
                        </div>
                        <div className={style.Row}>
                            <div className={style.RowTitle}>Data de Entrega:</div>
                            <div className={style.RowDescription}>
                                {new Date(project.project?.delivery_date as Date).toLocaleDateString('pt-BR')}
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
                                <button onClick={() => bookPdf()} className="btn btn-dark">Download</button>
                            </div>
                        </div>
                    </div>
                    {project.project?.images?.length as number > 0 ? (
                        <div style={{width: '100%', marginTop: '2rem'}}>
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
                    {project.project?.videos?.length as number > 0 ? (
                        <div style={{width: '100%'}}>
                        </div>
                    ) : null}
                </div>
            </Container>
        </div>
    )
}