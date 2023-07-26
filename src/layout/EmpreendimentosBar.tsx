import { stylePropsToThemeKeys } from "@aws-amplify/ui-react/dist/types/primitives/shared/constants"
import Container from "./Container"

import style from '../styles/Empreendimentos.module.css'
import { useRouter } from "next/router"

export default function EmpreendimentosBar(props: {selectPremium?: boolean, backToAdmin?: boolean}) {
    const router = useRouter()
    return (
        <div style={{ width: '100&', height: 'auto', display: 'flex' }}>
            <Container>
                <div className={style.EmpreendimentosBar}>
                    { !props.backToAdmin ? (<button onClick={() => router.push('/painel')} className="btn btn-outline-dark">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                            </svg>
                        </span> Painel</button>) : (
                            <button onClick={() => router.push('/painel/empreendimentos-admin')} className="btn btn-outline-dark">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                                    <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                                </svg>
                            </span> Painel Administrativo</button>
                        )}
                    {props.selectPremium ? (
                    <button onClick={() => router.push('/painel/empreendimentos-admin/select-premium')} className={`btn btn-dark ${style.SelectPremiumBtBar}`} >Selecionar Empreendimentos Premium</button>) : null}
                </div>
            </Container>
        </div>
    )
}