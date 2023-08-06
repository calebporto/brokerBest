import Image from 'next/image'
import style from '../styles/ProjectCard.module.css'
import { allFirstUppercase } from '@/helpers/helpers'
import { MouseEvent, useContext, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import Modal from './Modal'

export default function ProjectCard(props: {
    id?: number,
    thumb: string,
    name?: string,
    deliveryDate?: string,
    admin_id?: number
}) {
    const context = useContext(AuthContext)
    const { setSystemMessage } = context
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)

    function open(event: MouseEvent, id: number | null | undefined) {
        if (id) {
            router.push(`/painel/empreendimentos?id=${id}`)
        }
    }
    function edit(event: MouseEvent, id: number | null | undefined) {
        event.stopPropagation()
        if (id) {
            router.push(`/painel/empreendimentos/editar-empreendimento?id=${id}`)
        }
    }
    async function pjDelete(event: MouseEvent, id: number | null | undefined) {
        event.stopPropagation()
        if (id) {
            const deleteProject = await fetch(`/api/projects/project-delete?id=${id}`).then(response => {
                if (!response.ok) return false
                else return true
            })
            if (deleteProject) {
                router.reload()
            } else {
                setSystemMessage(`Algo deu errado. Tente novamente mais tarde.`)
                setShowModal(false)
                return
            }
        }
    }
    return (
        <div className={style.Card} onClick={(e) => open(e, props.id)}>
            {/* <div className={style.Image}>
                <Image priority className={style.Img} src={props.thumb} width={600} height={450} alt='' />
            </div> */}
            <div className={style.Title}>
                <p>{allFirstUppercase(props.name as string)}</p>
            </div>
            <div className={style.Info}>
                {/* <div className={style.DeliveryDate}>
                    <p><span>Data de Entrega: </span> {props.deliveryDate ? props.deliveryDate : null}</p>
                </div> */}
                {context.user.is_admin ? (
                    <>
                        <div className={style.EditarBt}>
                            <button className={"btn btn-warning "} onClick={(e) => edit(e, props.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{ margin: 'auto' }} fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                </svg>
                            </button>
                        </div>
                        <Modal show={showModal} setShow={setShowModal} title={'Tem certeza?'} shortModal={true}>
                            <p>Essa ação é definitiva.</p>
                            <div className={style.ConfirmarModalBt}>
                                <button onClick={(e) => { e.stopPropagation(); pjDelete(e, props.id)}} className="btn btn-danger">Excluir</button>
                            </div>
                        </Modal>
                        <div className={style.EditarBt}>
                            <button className={"btn btn-warning "} onClick={(e) => {e.stopPropagation(); setShowModal(true)}}>
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
    )
}