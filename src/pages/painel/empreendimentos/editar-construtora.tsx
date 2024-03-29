import { AuthContext } from "@/contexts/AuthContext"
import TitleBar from "@/layout/TitleBar"
import TopNavbar from "@/layout/TopNavbar"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import style from '../../../styles/Form.module.css'
import Head from "next/head"
import IMask from "imask"
import Alert, { _throwAlert } from "@/layout/Alert"
import { compressAndUploadToIbb, compressFile, uploadToIbb } from "@/helpers/helpers"
import { Company } from "@/classes"
import EmpreendimentosBar from "@/layout/EmpreendimentosBar"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import ThumbEdit from "@/layout/ThumbEdit"
import Modal from "@/layout/Modal"

export const getServerSideProps: GetServerSideProps<{ company: Company | null }> = async (context) => {
    try {
        const session = await getServerSession(context.req, context.res, authOptions)
        if (!session || session.user.is_admin == false) {
            return { props: { company: null } }
        }
        const getcompany = async () => {
            let url = `${process.env.API_URL}/project-services/get-company-by-id?id=${context.query.id}
            `
            return await fetch(url, {
                headers: {
                    'authenticator': process.env.AUTH_KEY as string
                }
            })
                .then(response => {
                    if (!response.ok) return null
                    else return response.json().then((data: Company) => {
                        return data
                    })
                })
        }
        const company = await getcompany()
        if (company != null) {
            return { props: { company } }
        } else {
            return { props: { company: null } }
        }
    } catch (error) {
        console.log(error)
        return { props: { company: null } }
    }
}

export default function AddConstrutora({ company }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const [name, setName] = useState<string | null>('')
    const [description, setDescription] = useState<string | null>('')
    const [email, setEmail] = useState<string | null>('')
    const [tel, setTel] = useState<string | null>('')
    const [address, setAddress] = useState<string | null>('')
    const [num, setNum] = useState<string | null>('')
    const [complement, setComplement] = useState<string | null>('')
    const [district, setDistrict] = useState<string | null>('')
    const [city, setCity] = useState<string | null>('')
    const [uf, setUf] = useState<string | null>('')
    const [currentImageG, setCurrentImageG] = useState<string>('')
    const [fileImgG, setFileImgG] = useState<FileList | null>(null)
    const [compressedImgG, setCompressedImgG] = useState<File | null>(null)
    const [currentImageM, setCurrentImageM] = useState<string>('')
    const [fileImgM, setFileImgM] = useState<FileList | null>(null)
    const [compressedImgM, setCompressedImgM] = useState<File | null>(null)
    const [currentImageP, setCurrentImageP] = useState<string>('')
    const [fileImgP, setFileImgP] = useState<FileList | null>(null)
    const [compressedImgP, setCompressedImgP] = useState<File | null>(null)
    const [imgLoading, setImgLoading] = useState(false)
    const [showPage, setShowPage] = useState(false)
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    const context = useContext(AuthContext)
    const { session, user, setSystemMessage } = context
    const [showWaitingModal, setShowWaitingModal] = useState(false)

    var sendBt: HTMLButtonElement | null;
    useEffect(() => {
        if (session != undefined && user.name) {
            if (session == null) {
                router.push('/entrar')
            } else if (!session.user.is_authenticated) {
                router.push('/entrar/auth-email')
            } else if (user.is_complete_data == false) {
                router.push('/auth/login-social')
            } else {
                if (!showPage) {
                    if (!company) {
                        setSystemMessage('Algo deu errado. Tente novamente mais tarde.')
                        router.push('/painel/empreendimentos-admin')
                    } else {
                        setName(company.name ? company.name : '')
                        setDescription(company.description ? company.description : '')
                        setEmail(company.email ? company.email : '')
                        setTel(company.tel ? company.tel : '')
                        setAddress(company.address ? company.address : '')
                        setNum(company.num ? company.num : '')
                        setComplement(company.complement ? company.complement : '')
                        setDistrict(company.district ? company.district : '')
                        setCity(company.city ? company.city : '')
                        setUf(company.uf ? company.uf : '')
                        setCurrentImageG(company.thumbG ? company.thumbG : '')
                        setCurrentImageM(company.thumbM ? company.thumbM : '')
                        setCurrentImageP(company.thumbP ? company.thumbP : '')
                        setShowPage(true)
                    }
                }
            }
        }
    }, [session, user, company])

    //Visualização de imagem
    useEffect(() => {
        if (!fileImgG) return;
        setImgLoading(true)
        const compress = async() => {
            const compressed = await compressFile(fileImgG[0])
            const url = URL.createObjectURL(compressed);
            () => url && URL.revokeObjectURL(url);
            setCurrentImageG(url);
            setCompressedImgG(compressed)
            setImgLoading(false)
        }
        compress()
        .catch(console.error);
    }, [fileImgG]);
    useEffect(() => {
        if (!fileImgM) return;
        setImgLoading(true)
        const compress = async() => {
            const compressed = await compressFile(fileImgM[0])
            const url = URL.createObjectURL(compressed);
            () => url && URL.revokeObjectURL(url);
            setCurrentImageG(url);
            setCompressedImgG(compressed)
            setImgLoading(false)
        }
        compress()
        .catch(console.error);
    }, [fileImgM]);
    useEffect(() => {
        if (!fileImgP) return;
        setImgLoading(true)
        const compress = async() => {
            const compressed = await compressFile(fileImgP[0])
            const url = URL.createObjectURL(compressed);
            () => url && URL.revokeObjectURL(url);
            setCurrentImageG(url);
            setCompressedImgG(compressed)
            setImgLoading(false)
        }
        compress()
        .catch(console.error);
    }, [fileImgP]);

    useEffect(() => {
        if (showPage) {
            let telefone = document.getElementById('tel') as HTMLInputElement
            let telOptions = {
                mask: '(00) 00000-0000'
            };
            let telMask = IMask(telefone, telOptions);

            // let cep = document.getElementById('cep') as HTMLInputElement
            // let cepOptions = {
            // mask: '00.000-000'
            // };
            // let cepMask = IMask(cep, cepOptions);

            let numero = document.getElementById('num') as HTMLInputElement
            let numeroOptions = {
                mask: '000000'
            };
            let numeroMask = IMask(numero, numeroOptions);

            let uf = document.getElementById('uf') as HTMLInputElement
            let ufOptions = {
                mask: 'aa',
                prepare: function (str: string) {
                    return str.toUpperCase();
                }
            };
            let ufMask = IMask(uf, ufOptions);
        }
    }, [showPage])

    // Visualização de imagem
    // useEffect(() => {
    //     if (!compressedImgG) return;
    //     const url = URL.createObjectURL(compressedImgG);
    //     setTestImageURL(url);
    //     () => url && URL.revokeObjectURL(url);
    // }, [compressedImgG]);

    function throwAlert(message: string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }
    function limparFormulario() {
        setName('')
        setDescription('')
        setEmail('')
        setTel('')
        setAddress('')
        setNum('')
        setComplement('')
        setDistrict('')
        setCity('')
        setUf('')
    }
    async function register() {
        setAlertShow(false)
        if (!name) {
            throwAlert('Nome inválido.', 'danger')
            return
        }
        setShowWaitingModal(true)

        var ibbResponseG = undefined
        if (compressedImgG) {
            let imgName = `${name.replace(' ', '_')}_thumbG`
            ibbResponseG = await uploadToIbb(compressedImgG, imgName)
        }
        var ibbResponseM = undefined
        if (compressedImgM) {
            let imgName = `${name.replace(' ', '_')}_thumbM`
            ibbResponseM = await uploadToIbb(compressedImgM, imgName)
        }
        var ibbResponseP = undefined
        if (compressedImgP) {
            let imgName = `${name.replace(' ', '_')}_thumbP`
            ibbResponseP = await uploadToIbb(compressedImgP, imgName)
        }

        if (ibbResponseG === null) {
            console.log('errado')
            throwAlert('Algo deu errado. Tente novamente mais tarde.', 'danger')
            setShowWaitingModal(false)
        } else if (ibbResponseM === null) {
            throwAlert('Algo deu errado. Tente novamente mais tarde.', 'danger')
            setShowWaitingModal(false)
        }else if (ibbResponseP === null) {
            throwAlert('Algo deu errado. Tente novamente mais tarde.', 'danger')
            setShowWaitingModal(false)
        } else {
            const imgG = ibbResponseG ? ibbResponseG.data.image.url : null
            const imgM = ibbResponseM ? ibbResponseM.data.image.url : null
            const imgP = ibbResponseP ? ibbResponseP.data.image.url : null
            const newCompany = new Company(
                company && company.id ? company.id : null,
                name != '' ? name : null,
                description != '' ? description : null,
                email != '' ? email : null,
                tel != '' ? tel : null,
                address != '' ? address : null,
                num != '' ? num : null,
                complement != '' ? complement : null,
                district != '' ? district : null,
                city != '' ? city : null,
                uf != '' ? uf : null,
                null,
                imgG ? imgG : null,
                imgM ? imgM : null,
                imgP ? imgP : null,
                null,
                user.id,
                true
            )
            const send = await fetch('/api/projects/company-edit', {
                method: 'POST',
                body: JSON.stringify({company: newCompany}),
                headers: {authorization: process.env.NEXT_PUBLIC_API_TOKEN as string}
            }).then(response => {
                if (!response.ok) return false
                else return true
            })
            if (!send) {
                setShowWaitingModal(false)
                throwAlert('Algo deu errado. Tente novamente mais tarde.', 'danger')
            } else {
                setShowWaitingModal(false)
                setSystemMessage('Cadastro alterado com sucesso.')
                router.push('/painel/empreendimentos-admin')
            }
        }
        
        limparFormulario()
        if (sendBt) {
            sendBt.innerHTML = 'Enviar'
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
            <TitleBar title={'Adicionar Construtora'}></TitleBar>
            <EmpreendimentosBar backToAdmin={true}></EmpreendimentosBar>
            <div className={style.Body}>
                <div className={style.Form}>
                    <Alert handleShow={setAlertShow}
                        show={alertShow}
                        message={alertMessage}
                        type={alertType} />
                    <Modal show={showWaitingModal} shortModal={true} title={'Aguarde'}>
                        <span>Aguarde enquanto é feito o upload das imagens. Isso pode levar
                            mais de um minuto...
                        </span>
                        <br />
                        <div className="spinner-border text-warning" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </Modal>
                    <ThumbEdit imgLoading={imgLoading} link={currentImageG} setFile={setFileImgG}></ThumbEdit>
                    <ThumbEdit size="M" imgLoading={imgLoading} link={currentImageM} setFile={setFileImgM}></ThumbEdit>
                    <ThumbEdit size="P" imgLoading={imgLoading} link={currentImageP} setFile={setFileImgP}></ThumbEdit>
                    <div className={style.LgInput}>
                        <span>Nome da Construtora:</span>
                        <input value={name as string} onChange={(e) => setName(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.LgInput}>
                        <span>Descrição:</span>
                        <textarea value={description as string} onChange={(e) => setDescription(e.target.value)} maxLength={500} name="" id="" rows={4}></textarea>
                    </div>
                    <div className={style.MdInput}>
                        <span>Email:</span>
                        <input value={email as string} onChange={(e) => setEmail(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Telefone:</span>
                        <input value={tel as string} onChange={(e) => setTel(e.target.value)} id="tel" maxLength={15} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Endereço:</span>
                        <input value={address as string} onChange={(e) => setAddress(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.SmInput + ' ' + style.Right}>
                        <span>Número:</span>
                        <input value={num as string} onChange={(e) => setNum(e.target.value)} id="num" maxLength={6} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Complemento:</span>
                        <input value={complement as string} onChange={(e) => setComplement(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Bairro:</span>
                        <input value={district as string} onChange={(e) => setDistrict(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Cidade:</span>
                        <input value={city as string} onChange={(e) => setCity(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.SmInput + ' ' + style.Right}>
                        <span>UF:</span>
                        <input value={uf as string} onInput={(e) => setUf(e.currentTarget.value)} onChange={(e) => setUf(e.target.value)} id="uf" maxLength={2} type="text" />
                    </div>
                    <div className={style.SendButton}>
                        <button id="sendBt" onClick={() => register()} className="btn btn-warning">Enviar</button>
                    </div>
                </div>
            </div>
        </> : null
    )
}