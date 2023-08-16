import { AuthContext } from "@/contexts/AuthContext"
import TitleBar from "@/layout/TitleBar"
import TopNavbar from "@/layout/TopNavbar"
import { useRouter } from "next/router"
import { InputHTMLAttributes, LegacyRef, useContext, useEffect, useRef, useState } from "react"
import style from '../../../styles/Form.module.css'
import Head from "next/head"
import IMask from "imask"
import Alert, { _throwAlert } from "@/layout/Alert"
import { compressAndUploadToIbb, compressFile } from "@/helpers/helpers"
import Image from "next/image"
import { Company } from "@/classes"
import EmpreendimentosBar from "@/layout/EmpreendimentosBar"
import Modal from "@/layout/Modal"

export default function AddConstrutora() {
    const router = useRouter()
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [tel, setTel] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [num, setNum] = useState<string>('')
    const [complement, setComplement] = useState<string>('')
    const [district, setDistrict] = useState<string>('')
    const [city, setCity] = useState<string>('')
    const [uf, setUf] = useState<string>('')
    const [thumbG, setThumbG] = useState<FileList | null>(null)
    const [thumbM, setThumbM] = useState<FileList | null>(null)
    const [thumbP, setThumbP] = useState<FileList | null>(null)
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
                    setShowPage(true)
                }
            }
        }
    }, [session, user])

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
        var fileInputG = document.getElementById('fileInputG') as HTMLInputElement
        fileInputG.value = ''
        fileInputG.files = null
        var fileInputM = document.getElementById('fileInputM') as HTMLInputElement
        fileInputM.value = ''
        fileInputM.files = null
        var fileInputP = document.getElementById('fileInputP') as HTMLInputElement
        fileInputP.value = ''
        fileInputP.files = null
    }
    async function register() {
        setAlertShow(false)
        if (!name) {
            throwAlert('Nome inválido.', 'danger')
            return
        }
        setShowWaitingModal(true)

        var ibbResponseG = null
        if (thumbG && thumbG?.length > 0) {
            let imgName = `${name.replace(' ', '_')}_thumbG`
            ibbResponseG = await compressAndUploadToIbb(thumbG[0], imgName)
        }
        var ibbResponseM = null
        if (thumbM && thumbM?.length > 0) {
            let imgName = `${name.replace(' ', '_')}_thumbM`
            ibbResponseM = await compressAndUploadToIbb(thumbM[0], imgName)
        }
        var ibbResponseP = null
        if (thumbP && thumbP?.length > 0) {
            let imgName = `${name.replace(' ', '_')}_thumbP`
            ibbResponseP = await compressAndUploadToIbb(thumbP[0], imgName)
        }

        if (thumbG && thumbG?.length > 0 && !ibbResponseG) {
            throwAlert('Algo deu errado. Tente novamente mais tarde.', 'danger')
            setShowWaitingModal(false)
        } else if (thumbM && thumbM?.length > 0 && !ibbResponseM) {
            throwAlert('Algo deu errado. Tente novamente mais tarde.', 'danger')
            setShowWaitingModal(false)
        } else if (thumbP && thumbP?.length > 0 && !ibbResponseP) {
            throwAlert('Algo deu errado. Tente novamente mais tarde.', 'danger')
            setShowWaitingModal(false)
        } else {
            const newCompany = new Company(
                null,
                name,
                description,
                email,
                tel,
                address,
                num,
                complement,
                district,
                city,
                uf,
                null,
                ibbResponseG ? ibbResponseG.data.image.url : '',
                ibbResponseM ? ibbResponseM.data.image.url : '',
                ibbResponseP ? ibbResponseP.data.image.url : '',
                null,
                user.id,
                true
            )
            const send = await fetch('/api/projects/add-company', {
                method: 'POST',
                body: JSON.stringify({ company: newCompany }),
                headers: { authorization: process.env.NEXT_PUBLIC_API_TOKEN as string }
            }).then(response => {
                if (!response.ok) return false
                else return true
            })
            if (!send) {
                throwAlert('Algo deu errado. Tente novamente mais tarde.', 'danger')
                setShowWaitingModal(false)
            } else {
                setShowWaitingModal(false)
                setSystemMessage('Construtora cadastrada com sucesso.')
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
                    <div className={style.LgInput}>
                        <span>Nome da Construtora:</span>
                        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.LgInput}>
                        <span>Descrição:</span>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} name="" id="" rows={4}></textarea>
                    </div>
                    <div className={style.MdInput}>
                        <span>Email:</span>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Telefone:</span>
                        <input value={tel} onChange={(e) => setTel(e.target.value)} id="tel" maxLength={15} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Endereço:</span>
                        <input value={address} onChange={(e) => setAddress(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.SmInput + ' ' + style.Right}>
                        <span>Número:</span>
                        <input value={num} onChange={(e) => setNum(e.target.value)} id="num" maxLength={6} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Complemento:</span>
                        <input value={complement} onChange={(e) => setComplement(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Bairro:</span>
                        <input value={district} onChange={(e) => setDistrict(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Cidade:</span>
                        <input value={city} onChange={(e) => setCity(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.SmInput + ' ' + style.Right}>
                        <span>UF:</span>
                        <input value={uf} onInput={(e) => setUf(e.currentTarget.value)} onChange={(e) => setUf(e.target.value)} id="uf" maxLength={2} type="text" />
                    </div>
                    <div className={style.ImageInput}>
                        <span>Imagem grande para patrocínio (O tamanho deve ser 1000x300px):</span>
                        <input max={1} onChange={(e) => setThumbG(e.target.files)} id="fileInputG" type="file" accept="image/*" />
                    </div>
                    <div className={style.ImageInput}>
                        <span>Imagem média para patrocínio (O tamanho deve ser 750x300px):</span>
                        <input max={1} onChange={(e) => setThumbM(e.target.files)} id="fileInputM" type="file" accept="image/*" />
                    </div>
                    <div className={style.ImageInput}>
                        <span>Imagem pequena para patrocínio (O tamanho deve ser 350x250px):</span>
                        <input max={1} onChange={(e) => setThumbP(e.target.files)} id="fileInputP" type="file" accept="image/*" />
                    </div>
                    <div className={style.SendButton}>
                        <button id="sendBt" onClick={() => register()} className="btn btn-warning">Enviar</button>
                    </div>
                </div>
            </div>
        </> : null
    )
}