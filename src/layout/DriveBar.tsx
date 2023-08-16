import { ReactNode, createRef, useContext, useEffect, useRef, useState } from 'react'
import style from '../styles/DriveBar.module.css'
import Container from './Container'
import { useRouter } from 'next/router'
import { BasicProject, Company, Project, ProjectData, ProjectQueryParams, ProjectResponse } from '@/helpers/interfaces'
import { ProjectDataClass, ProjectQueryParamsClass } from '@/classes'
import ProjectCard from './ProjectCard'
import { allFirstUppercase } from '@/helpers/helpers'
import Map from './Map'
import { PremiumContext } from '@/contexts/PremiumContext'
import Image from 'next/image'
import Modal from './Modal'

const InitQueryParams = new ProjectQueryParamsClass()
const InitProjectData = new ProjectDataClass()

export default function DriveBar() {
    const [bairroSelect, setBairroSelect] = useState(false)
    const [regiaoSelect, setRegiaoSelect] = useState(false)
    const [construtoraSelect, setContrutoraSelect] = useState(false)
    const [mapSelect, setMapSelect] = useState(false)
    const [itemList, setItemList] = useState<ReactNode>(null)
    const [selectedFilter, setSelectedFilter] = useState<ReactNode>(null)
    const filterType = useRef<string>()
    const queryParams = useRef<ProjectQueryParams>(InitQueryParams)
    const projectData = useRef<ProjectData>(InitProjectData)
    const [projectElements, setProjectElements] = useState<Array<JSX.Element>>([])
    const [showList, setShowList] = useState(true)
    const [showVerMais, setShowVerMais] = useState(false)
    const { companyes } = useContext(PremiumContext)
    const [premiumElements, setPremiumElements] = useState<Array<JSX.Element> | null>(null)
    const [showPremiumModal, setShowPremiumModal] = useState(false)
    const router = useRouter()

    useEffect(() => {
        projectData.current.data = []
        projectData.current.partialCount = 0
        projectData.current.totalCount = 0
        queryParams.current = InitQueryParams
        verMaisShow()
        porBairro()
    }, [])
    useEffect(() => {
        if (mapSelect) {
            setShowList(false)
            //initMap()
        } 
        else {
            setShowList(true)
            //destroyMap()
        } 
    }, [mapSelect])
    useEffect(() => {
        function renderPremium(companyes: Array<Company>): Array<JSX.Element> {
            return companyes.map((company, index) => {
                return (
                    <div onClick={() => console.log(company.id)} key={`premiumImg${index.toString()}`} className={style.CompanyImg}>
                        <Image src={company.thumb || ''} width={1000} height={300} alt='' />
                    </div>
                )
            })
        }
        if (!companyes || companyes.length == 0) return
        else {
            setPremiumElements(renderPremium(companyes))
            setShowPremiumModal(true)
        }
    }, [companyes])

    function getProjectsData() {
        fetch(`/api/projects/get-projects?filterBy=${filterType.current}&key=${queryParams.current.key}&orderBy=${queryParams.current.order_by}&offset=${queryParams.current.offset}&guidance=${queryParams.current.guidance}`)
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
                    selectedFilterGenerate()
                    verMaisShow()
                })
            }
        })

    }
    function selectedFilterGenerate() {
        let bt = (
            <button className='btn btn-dark' disabled><span>{allFirstUppercase(filterType.current)}:</span>{allFirstUppercase(queryParams.current.key)}</button>
        )
        setSelectedFilter(bt)
    }
    function projectCardsGenerate() {
        let elements = [] as Array<JSX.Element>
        projectData.current.data.forEach(item => {
            // const Card = (
            //     <ProjectCard 
            //     key={item.id}
            //     id={item.id}
            //     thumb={item.thumb}
            //     name={item.name}
            //     deliveryDate={new Date(item.delivery_date as string).toLocaleDateString('pt-BR')}
            //     admin_id={item.admin_id}
            //     ></ProjectCard>
            // )
            const Card = (
                <div onClick={() => router.push('/painel/empreendimentos?id='+item.id)} className={style.ProjectCard + ' btn btn-dark'} key={`projectCard_${item.id}`}>
                    {allFirstUppercase(item.name)}
                </div>
            )
            elements.push(Card)
        })
        setProjectElements(elements)
    }
    function filterListGenerate(data: Array<string>) {
        let getProjects = (key: string) => {
            //setProjectList([])
            queryParams.current = InitQueryParams
            queryParams.current.key = key
            queryParams.current.offset = 0
            projectData.current.data = []
            getProjectsData()
        }

        if (data.length == 0) {
            return null
        }
        let bts = data.map((item, index) => {
            return (
                <div onClick={() => getProjects(item)} className={`btn btn-outline-dark ${style.FilterListBt}`} key={index}>
                    {allFirstUppercase(item)}
                </div>
            )
        })
        return (
            <>
                {bts}
            </>
        )
    }
    function getFilterData() {
        setItemList(
            <div className="d-flex justify-content-center" style={{width: '100%'}}>
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
        fetch(`/api/projects/drive-list?type=${filterType.current}`, {
            headers: {
                'authorization': process.env.NEXT_PUBLIC_API_TOKEN as string
            }
        })
            .then(response => {
                if (!response.ok) return null
                else {
                    return response.json()
                        .then((data: Array<string>) => {
                            setItemList(filterListGenerate(data))
                        })
                }
            })
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
    function porBairro() {
        if (bairroSelect) return

        setBairroSelect(true)
        setRegiaoSelect(false)
        setContrutoraSelect(false)
        setMapSelect(false)
        if (filterType.current != 'bairro') {
            filterType.current = 'bairro'
            getFilterData()
        }
    }
    function porRegiao() {
        if (regiaoSelect) return

        setRegiaoSelect(true)
        setBairroSelect(false)
        setContrutoraSelect(false)
        setMapSelect(false)
        if (filterType.current != 'regiao') {
            filterType.current = 'regiao'
            getFilterData()
        }
    }
    function porConstrutora() {
        if (construtoraSelect) return
        
        setContrutoraSelect(true)
        setBairroSelect(false)
        setRegiaoSelect(false)
        setMapSelect(false)
        if (filterType.current != 'construtora') {
            filterType.current = 'construtora'
            getFilterData()
        }
    }
    function porMapa() {
        if (mapSelect) return
        
        setMapSelect(true)
        setContrutoraSelect(false)
        setBairroSelect(false)
        setRegiaoSelect(false)
        if (filterType.current != 'mapa') {
            filterType.current = 'mapa'
        }
    }
    return (
        <div style={{ width: '100%', display: 'flex', height: 'auto' }}>
            <Container>
                <Modal show={showPremiumModal} setShow={setShowPremiumModal} title={'Premium'}>
                    {premiumElements}
                </Modal>
                <div className={style.DriveBar}>
                    <p className={style.Title}>
                        Drive Imobiliário
                    </p>
                    <div className={style.Filter}>
                        <button onClick={() => porBairro()} className={"btn " + `${bairroSelect ? 'btn-dark' : 'btn-warning'}`}>Por Bairro</button>
                        <button onClick={() => porRegiao()} className={"btn " + `${regiaoSelect ? 'btn-dark' : 'btn-warning'}`}>Por Região</button>
                        <button onClick={() => porConstrutora()} className={"btn " + `${construtoraSelect ? 'btn-dark' : 'btn-warning'}`}>Por Construtora</button>
                        <button onClick={() => porMapa()} className={`${style.MapBt} btn ${mapSelect ? 'btn-dark' : 'btn-warning'}`}>
                            <span>Mapa    </span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                            </svg>
                        </button>
                    </div>
                    {showList ? (
                    <div className={style.ShowFilter}>
                        <div className={style.FilterList}>
                            {itemList ? itemList : <p style={{ width: '100%', textAlign: 'center' }}>Nenhum dado encontrado</p>}
                        </div>
                        <div className={style.SelectedFilter}>
                            {selectedFilter && (
                                <>
                                    {selectedFilter}
                                    <span>Exibindo 
                                        {" " + projectData.current.partialCount.toString()} 
                                        {projectData.current.partialCount > 1 ? ' itens ' : ' item '} 
                                        de {projectData.current.totalCount.toString()} no total.</span>
                                </>
                            )}
                        </div>
                    </div>): null}
                    {showList ? (
                    <div className={style.List}>
                        {projectElements.length > 0 ? [...projectElements] : null}
                        {projectData.current.partialCount < projectData.current.totalCount ? (
                            <button onClick={() => verMais()} className={"btn btn-warning " + style.VerMaisBt}>Ver Mais</button>
                        ) : null}
                    </div>) : null}
                    {mapSelect ? (
                        <div className={style.Map}>
                            <Map></Map>
                        </div>
                    ): null}
                </div>
            </Container>
        </div>
    )
}