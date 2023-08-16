import { AuthContext } from "@/contexts/AuthContext"
import { PremiumCompanyData, PremiumQuery } from "@/helpers/interfaces"
import EmpreendimentosBar from "@/layout/EmpreendimentosBar"
import Footer from "@/layout/Footer"
import TitleBar from "@/layout/TitleBar"
import TopNavbar from "@/layout/TopNavbar"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getServerSession } from "next-auth"
import Head from "next/head"
import { useContext, useEffect, useState } from "react"
import style from '../../../styles/SelectPremium.module.css'
import Container from "@/layout/Container"
import { useRouter } from "next/router"
import { allFirstUppercase } from "@/helpers/helpers"
import Alert, { _throwAlert } from "@/layout/Alert"
import Modal from "@/layout/Modal"

export const getServerSideProps: GetServerSideProps<{ premiumQuery: PremiumQuery | null }> = async (context) => {
    try {
        const session = await getServerSession(context.req, context.res, authOptions)
        if (!session) {
            return { props: { premiumQuery: null } }
        }
        const getPremiumQuery = async () => {
            let url = `${process.env.API_URL}/project-services/get-premium-query`
            return await fetch(url, {
                headers: {
                    'authenticator': process.env.AUTH_KEY as string
                }
            })
                .then(response => {
                    if (!response.ok) return null
                    else return response.json().then((data: PremiumQuery) => {
                        return data
                    })
                })
        }
        const premiumQuery = await getPremiumQuery()
        if (premiumQuery != null) {
            return { props: { premiumQuery } }
        } else {
            return { props: { premiumQuery: null } }
        }
    } catch (error) {
        console.log(error)
        return { props: { premiumQuery: null } }
    }
}

export default function SelectPremium({ premiumQuery }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const context = useContext(AuthContext)
    const { session, user, setSystemMessage } = context
    const [premiumList, setPremiumList] = useState<Array<PremiumCompanyData>>([])
    const [premiumButtons, setPremiumButtons] = useState<Array<JSX.Element>>([])
    const [companyList, setCompanyList] = useState<Array<PremiumCompanyData>>([])
    const [companyOptions, setCompanyOptions] = useState<Array<JSX.Element>>([])
    const router = useRouter()
    const [showPage, setShowPage] = useState(false)
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    const [showWaitingModal, setShowWaitingModal] = useState(false)
    function throwAlert(message: string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }

    useEffect(() => {
        if (session && user.name) {
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
        }
    }, [session, user])

    useEffect(() => {
        if (premiumQuery == null) {
            setSystemMessage('Erro ao carregar as construtoras premium.')
            router.push('/painel/empreendimentos-admin')
        } else {
            setPremiumList(premiumQuery.premiumList)
            setCompanyList(premiumQuery.companyList)
        }
    }, [premiumQuery])

    useEffect(() => {
        function renderPremiumBts(list: Array<PremiumCompanyData>): Array<JSX.Element> {
            function removePremium(id: number) {
                var newList = premiumList.filter(item => item.id != id)
                setPremiumList(newList)
            }
            return list.map((company, index) => {
                return (
                    <div key={'premiumBt_' + index.toString()} className={style.PremiumBt}>
                        <div onClick={() => router.push(`/painel/empreendimentos?id=${company.id}`)} className={style.PremiumBtText}><span>{allFirstUppercase(company.name)}</span></div>
                        <div onClick={() => removePremium(company.id)} className={style.PremiumBtClose}><span>x</span></div>
                    </div>
                )
            })
        }
        if (premiumList.length != premiumButtons.length) {
            setPremiumButtons(renderPremiumBts(premiumList))
        }
    }, [premiumList])

    useEffect(() => {
        function renderCompanyOptions(list: Array<PremiumCompanyData>): Array<JSX.Element> {
            return list.map((company, index) => {
                return (
                    <option key={'selectOption_' + index.toString()} value={company.id}>{allFirstUppercase(company.name)}</option>
                )
            })
        }
        setCompanyOptions(renderCompanyOptions(companyList))
    }, [companyList])

    function addPremium() {
        if (premiumList.length > 2) {
            throwAlert('Só são permitidos até 3 empreendimentos premium', 'danger')
            return
        }
        var select = document.querySelector('#selectPremium') as HTMLSelectElement
        if (select && select.selectedIndex != 0) {
            let id = select.options[select.selectedIndex].value
            let name = select.options[select.selectedIndex].innerHTML

            let newPremiumProject = {
                id: parseInt(id),
                name: name
            }
            let newPremium = premiumList.map(item => item)

            // Verifica se já tem o mesmo empreendimento entre os premium
            for (let i = 0; i < newPremium.length; i++) {
                if (newPremium[i].id == newPremiumProject.id) {
                    throwAlert('Esta construtora já está na lista.', 'warning')
                    return
                }
            }
            newPremium.push(newPremiumProject)
            setPremiumList(newPremium)
        }
    }
    function changePremium() {
        setAlertShow(false)
        setShowWaitingModal(true)
        
        const data = {'list': premiumList}
        fetch('/api/projects/changePremium', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(response => {
            if(!response.ok) {
                setShowWaitingModal(false)
                throwAlert('Erro ao cadastrar. Tente novamente mais tarde.', 'danger')
                return
            } else {
                window.location.href = '/painel'
            }
        })
    }

    return (
        <>
            <Head>
                <title>Broker Best</title>
                <meta name="description" content="Broker Best teste" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <TopNavbar contextUser={context}></TopNavbar>
            <TitleBar title={'Selecionar Premium'}></TitleBar>
            <Alert show={alertShow} setMessage={setAlertMessage} message={alertMessage} handleShow={setAlertShow} type={alertType} showSystemMessage={true}></Alert>
            <EmpreendimentosBar backToAdmin={true}></EmpreendimentosBar>
            <Modal show={showWaitingModal} shortModal={true} title={'Aguarde'}>
                <span>Aguarde...
                </span>
                <br />
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Modal>
            <div style={{ width: '100%', display: 'flex' }}>
                <Container>
                    <div className={style.PremiumShow}>
                        <div className={style.Title}>
                            <p>Construtoras Premium:</p>
                        </div>
                        <div className={style.Display}>
                            {premiumButtons.length > 0 ? premiumButtons : (
                                <p>Nenhuma construtora premium selecionada.</p>
                            )}
                        </div>
                    </div>
                    <div className={style.SelectNewPremium}>
                        <div className={style.Title}>
                            <p>Adicionar:</p>
                        </div>
                        <div className={style.Select}>
                            <select name="" id="selectPremium">
                                <option value="" selected disabled>--  Selecione um empreendimento  --</option>
                                {[...companyOptions]}
                            </select>
                            <button onClick={() => addPremium()} className="btn btn-dark">Adicionar</button>
                        </div>
                    </div>
                    <button onClick={() => changePremium()} className={'btn btn-warning ' + style.SaveBt}>Salvar</button>
                </Container>
            </div>
            <Footer></Footer>
        </>
    )
}