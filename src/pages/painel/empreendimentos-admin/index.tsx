import { AuthContext } from "@/contexts/AuthContext"
import TitleBar from "@/layout/TitleBar"
import TopNavbar from "@/layout/TopNavbar"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getServerSession } from "next-auth"
import Head from "next/head"
import { useContext, useEffect, useRef, useState } from "react"
import { Company, GeneralContext, Project, ProjectData, ProjectQueryParams, ProjectResponse } from "@/helpers/interfaces"
import MEStyle from '@/styles/MeusEmpreendimentos.module.css'
import CompanyCard from "@/layout/CompanyCard"
import Container from "@/layout/Container"
import { ProjectDataClass, ProjectQueryParamsClass } from "@/classes"
import ProjectCard from "@/layout/ProjectCard"
import { useRouter } from "next/router"
import EmpreendimentosBar from "@/layout/EmpreendimentosBar"
import Alert, { _throwAlert } from "@/layout/Alert"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export const getServerSideProps: GetServerSideProps<{ companies: Array<Company> | null }> = async (context) => {
    try {
        const session = await getServerSession(context.req, context.res, authOptions)
        if (!session) {
            return { props: { companies: null } }
        }
        const getCompanies = async () => {
            let url = `${process.env.API_URL}/project-services/get-companies?userEmail=${session.user.email}
            `
            return await fetch(url, {
                headers: {
                    'authenticator': process.env.AUTH_KEY as string
                }
            })
                .then(response => {
                    if (!response.ok) return null
                    else return response.json().then((data: Array<Company>) => {
                        return data
                    })
                })
        }
        const companies = await getCompanies()
        if (companies != null) {
            return { props: { companies } }
        } else {
            return { props: { companies: null } }
        }
    } catch (error) {
        console.log(error)
        return { props: { companies: null } }
    }
}

const InitQueryParams = new ProjectQueryParamsClass()
const InitProjectData = new ProjectDataClass()

export default function MeusEmpreendimentos({ companies }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const context = useContext(AuthContext) as GeneralContext
    const router = useRouter()
    const [companiesElements, setCompaniesElements] = useState<Array<JSX.Element> | null>(null)
    const projectData = useRef<ProjectData>(InitProjectData)
    const queryParams = useRef<ProjectQueryParams>(InitQueryParams)
    const [projectElements, setProjectElements] = useState<Array<JSX.Element>>([])
    const [showVerMais, setShowVerMais] = useState(false)
    const [windowElement, setWindowElement] = useState<Window | null>(null)
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    
    function throwAlert(message:string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }
    const { session, user } = context
    const [showPage, setShowPage] = useState(false)

    useEffect(() => {
        if (!windowElement) {
            setWindowElement(window)
        }
        if (companies && !companiesElements) {
            setCompaniesElements(companyCards(companies))
        }
        projectData.current.data = []
        projectData.current.partialCount = 0
        projectData.current.totalCount = 0
        queryParams.current = InitQueryParams
        verMaisShow()
    }, [])
    
    if (session == undefined) return
    if (session == null) {
        router.push('/entrar')
    } else if (!session.user.is_authenticated) {
        router.push('/entrar/auth-email')
    } else if (user.is_complete_data == false) {
        router.push('/auth/login-social')
    } else {
        if (!showPage) {
            // Página disponível apenas para admin. Futuramente pode ser mudado.
            if (user.is_admin) {
                setShowPage(true)
            } else {
                router.push('/painel')
            }
        }
    }

    function getProjectsData() {
        var list = document.querySelector('#List') as HTMLDivElement
        list.focus()
        fetch(`/api/projects/get-projects?filterBy=companyId&key=${queryParams.current.key}&orderBy=${queryParams.current.order_by}&offset=${queryParams.current.offset}&guidance=${queryParams.current.guidance}`)
            .then(response => {
                if (!response.ok) return null
                else {
                    return response.json().then((data: ProjectResponse) => {
                        data.data.forEach(project => {
                            let idList = projectData.current.data.map(item => item.id)
                            if (idList.indexOf(project.id) == -1) projectData.current.data.push(project)
                        })
                        queryParams.current.offset = projectData.current.data.length
                        projectData.current.partialCount = projectData.current.data.length
                        projectData.current.totalCount = data.count
                        projectCardsGenerate()
                        verMaisShow()
                    })
                }
            })

    }
    function projectCardsGenerate() {
        let elements = [] as Array<JSX.Element>
        projectData.current.data.forEach(item => {
            const Card = (
                <ProjectCard
                    key={item.id}
                    id={item.id}
                    thumb={item.thumb}
                    name={item.name}
                    deliveryDate={new Date(item.delivery_date as string).toLocaleDateString('pt-BR')}
                    admin_id={item.admin_id}
                ></ProjectCard>
            )
            elements.push(Card)
        })
        setProjectElements(elements)
    }
    function companyCards(companiesData: Array<Company>) {
        let list = [] as Array<JSX.Element>

        companiesData.forEach(company => {
            list.push(
                <CompanyCard companyData={company} getProjects={getProjectsData} queryParams={queryParams} projectData={projectData}></CompanyCard>
            )
        })
        return list
    }
    function verMais() {
        getProjectsData()
    }
    function verMaisShow() {
        if (projectData.current.partialCount < projectData.current.totalCount) {
            if (!showVerMais) setShowVerMais(true)
        } else {
            if (showVerMais) setShowVerMais(false)
        }
    }
    return (
        showPage ? <>
            <Head>
                <title>Broker Best</title>
                <meta name="description" content="Broker Best teste" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <TopNavbar contextUser={context}></TopNavbar>
            <TitleBar title={'Meus Empreendimentos'}></TitleBar>
            <EmpreendimentosBar selectPremium={true}></EmpreendimentosBar>
            <div style={{ width: '100%', display: 'flex' }}>
                <Container>
                    <Alert show={alertShow} setMessage={setAlertMessage} message={alertMessage} handleShow={setAlertShow} type={alertType} showSystemMessage={true}></Alert>
                    <div className={MEStyle.Title}>
                        Selecione a construtora:
                    </div>
                    <div className={MEStyle.Companies}>
                        {companies && companies?.length > 0 ? (
                            <>
                                <button onClick={() => router.push(`/painel/empreendimentos/adicionar-construtora`)} className={`btn btn-dark ${MEStyle.EditarBt}`}>Adicionar Construtora</button>
                                {companiesElements}
                            </>
                        ) : (
                            <div className={MEStyle.NotEmp}>
                                <p>Você não possui nenhuma construtora cadastrada
                                    . <span onClick={() => router.push('/painel/empreendimentos/adicionar-construtora')}>Clique aqui para adicionar.</span>
                                </p>
                            </div>
                        )}
                        </div>
                </Container>
            </div>
            <div style={{width: '100%', display: 'flex'}}>
                <Container>
                    <div className={MEStyle.Title}>
                        Empreendimentos:
                    </div>
                    <div id="List" tabIndex={1} className={MEStyle.List}>
                        {projectElements.length > 0 ? [...projectElements] : (
                            <div className={MEStyle.NotEmp}>
                                <p>Nenhum empreendimento a mostrar. Talvez ainda não haja nenhum cadastrado
                                    ou talvez você não tenha selecionado uma construtora.
                                </p>
                            </div>
                        )}
                        {showVerMais ? (
                            <button onClick={() => verMais()} className={"btn btn-warning " + MEStyle.VerMaisBt}>Ver Mais</button>
                        ) : null}
                    </div>
                </Container>
            </div>
        </> : null
    )
}