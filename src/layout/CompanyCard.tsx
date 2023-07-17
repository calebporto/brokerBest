import { Company, ProjectData, ProjectQueryParams } from "@/helpers/interfaces";
import style from '../styles/CompanyCard.module.css'
import companyStyle from '../styles/Company.module.css'
import Image from "next/image";
import { allFirstUppercase, firstAndParagraphUppercase, parseAddress, windowOpen } from "@/helpers/helpers";
import { MutableRefObject, Ref, useContext, useEffect, useState } from "react";
import { ProjectDataClass, ProjectQueryParamsClass } from "@/classes";
import { useRouter } from "next/router";
import Modal from "./Modal";
import { AuthContext } from "@/contexts/AuthContext";

const InitQueryParams = new ProjectQueryParamsClass()
const InitProjectData = new ProjectDataClass()

export default (props: {
    companyData: Company,
    getProjects: Function,
    queryParams: MutableRefObject<ProjectQueryParams>,
    projectData: MutableRefObject<ProjectData>
}) => {
    const router = useRouter()
    const context = useContext(AuthContext)
    const { user } = context
    const [showViewModal, setShowViewModal] = useState(false)
    const [windowElement, setWindowElement] = useState<Window | null>(null)

    useEffect(() => {
        if (!windowElement) {
            setWindowElement(window)
        }
    }, [])

    function showProjects() {
        props.queryParams.current = InitQueryParams
        props.queryParams.current.key = props.companyData.id?.toString() as string
        props.queryParams.current.offset = 0
        props.projectData.current.data = []
        props.getProjects()
    }

    var companyElements = () => {
        const company = props.companyData
        return (
            <div className={companyStyle.Company}>
                {props.companyData?.thumb ? (
                    <Image onClick={() => windowOpen(windowElement, props.companyData?.thumb)} className={companyStyle.Thumb} alt="" src={props.companyData.thumb} width={1200} height={724}></Image>
                ) : null}
                {company?.admin_id == user.id || user.is_admin ? (
                    <div className={companyStyle.EditarBt}>
                        <button onClick={() => router.push(`/painel/empreendimentos/construtora/editar?id=${props.companyData.id}`)} className="btn btn-warning">Editar</button>
                    </div>
                ) : null}
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
        <div className={style.Card}>
            <div className={style.Image}>
                <Image className={style.Img} src={props.companyData.thumb as string} width={600} height={450} alt='' />
            </div>
            <div className={style.Title}>
                <p>{allFirstUppercase(props.companyData.name)}</p>
            </div>
            <div className={style.Buttons}>
                <button onClick={() => showProjects()} className={`btn btn-dark ${style.VerEmpBt}`}>Ver Empreendimentos</button>
                <button onClick={() => router.push(`/painel/empreendimentos/adicionar-empreendimento?companyId=${props.companyData.id}`)} className={`btn btn-warning ${style.VerEmpBt}`}>Adicionar Empreendimento</button>
                <Modal show={showViewModal} setShow={setShowViewModal} title={props.companyData.name}>
                    {companyElements()}
                </Modal>
                <button onClick={() => setShowViewModal(true)} className={`btn btn-warning ${style.OptBt}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                    </svg>
                </button>
                <button onClick={() => router.push(`/painel/empreendimentos/construtora/editar?id=${props.companyData.id}`)} className={`btn btn-warning ${style.OptBt}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                    </svg>
                </button>
            </div>
        </div>
    )
}