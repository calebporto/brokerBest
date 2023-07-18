import Image from 'next/image'
import style from '../styles/ProjectCard.module.css'
import { allFirstUppercase } from '@/helpers/helpers'
import { MouseEvent, useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'

export default function ProjectCard(props: {
    id?: number,
    thumb: string,
    name?: string,
    deliveryDate?: string,
    admin_id?: number
}) {
    const context = useContext(AuthContext)
    const router = useRouter()
    
    function open(event: MouseEvent, id: number | null | undefined) {
        if (id) {
            router.push(`/painel/empreendimentos?id=${id}`)
        }
    }
    function edit(event: MouseEvent, id: number | null | undefined) {
        event.stopPropagation()
        if (id) {
            router.push(`/painel/empreendimentos/editar?id=${id}`)
        }
    }
    return (
        <div className={style.Card} onClick={(e) => open(e, props.id) }>
            <div className={style.Image}>
                <Image className={style.Img} src={props.thumb} width={600} height={450} alt='' />
            </div>
            <div className={style.Title}>
                <p>{allFirstUppercase(props.name as string)}</p>
            </div>
            <div className={style.Info}>
                <div className={style.DeliveryDate}>
                    <p><span>Data de Entrega: </span> {props.deliveryDate ? props.deliveryDate : null}</p>
                </div>
                {props.admin_id == context.user.id || context.user.is_admin ? (
                    <div className={style.EditarBt}>
                        <button className={"btn btn-warning "} onClick={(e) => edit(e, props.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{margin: 'auto'}} fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                            </svg>
                        </button>
                    </div>
                ) : null
                }

            </div>
        </div>
    )
}