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
    const [currentImage, setCurrentImage] = useState<string>('')
    const [fileImg, setFileImg] = useState<FileList | null>(null)
    const [compressedImg, setCompressedImg] = useState<File | null>(null)
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
                        setCurrentImage(company.thumb ? company.thumb : '')
                        setShowPage(true)
                    }
                }
            }
        }
    }, [session, user, company])

    //Visualização de imagem
    useEffect(() => {
        if (!fileImg) return;
        setImgLoading(true)
        const compress = async() => {
            const compressed = await compressFile(fileImg[0])
            console.log('terminou')
            const url = URL.createObjectURL(compressed);
            () => url && URL.revokeObjectURL(url);
            setCurrentImage(url);
            setCompressedImg(compressed)
            setImgLoading(false)
        }
        compress()
        .catch(console.error);
    }, [fileImg]);

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
    //     if (!compressedImg) return;
    //     const url = URL.createObjectURL(compressedImg);
    //     setTestImageURL(url);
    //     () => url && URL.revokeObjectURL(url);
    // }, [compressedImg]);

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
        if (!description || description.length < 20) {
            throwAlert('Descreva com mais detalhes a construtora.', 'danger')
            return
        }
        if (!email || email.indexOf('@') == -1 || email.indexOf('.') == -1 || email.length < 8) {
            throwAlert('E-mail inválido.', 'danger')
            return
        }
        if (!tel || tel.length < 14 && tel.length > 15) {
            throwAlert('Telefone inválido.', 'danger')
            return
        }
        if (!address) {
            throwAlert('Endereço inválido.', 'danger')
            return
        }
        if (!num) {
            throwAlert('Número inválido.', 'danger')
            return
        }
        if (!district) {
            throwAlert('Bairro inválido.', 'danger')
            return
        }
        if (!city) {
            throwAlert('Cidade inválida.', 'danger')
            return
        }
        if (!uf) {
            throwAlert('UF inválido.', 'danger')
            return
        }
        setShowWaitingModal(true)

        var ibbResponse = undefined
        if (compressedImg) {
            const imgName = `${name.replace(' ', '_')}_thumb`
            ibbResponse = await compressAndUploadToIbb(compressedImg, imgName)
        }
        if (ibbResponse == null) {
            throwAlert('Algo deu errado. Tente novamente mais tarde.', 'danger')
        } else {
            const img = ibbResponse.data.image.url
            console.log('img= '+img)
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
                img ? img : null,
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
                    <ThumbEdit imgLoading={imgLoading} link={currentImage} setFile={setFileImg}></ThumbEdit>
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