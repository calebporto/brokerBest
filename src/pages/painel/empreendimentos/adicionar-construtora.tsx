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
    const [originalImg, setOriginalImg] = useState<FileList | null>(null)
    const [showPage, setShowPage] = useState(false)
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    const context = useContext(AuthContext)
    const { session, user } = context

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
        var fileInput = document.getElementById('fileInput') as HTMLInputElement
        fileInput.value = ''
        fileInput.files = null
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
        if (!originalImg || originalImg.length < 1) {
            throwAlert('Selecione uma imagem.', 'danger')
            return
        }
        sendBt = document.querySelector('#sendBt') as HTMLButtonElement
        if (sendBt) {
            sendBt.innerHTML = `
            <div class="spinner-border text-dark" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            `
        }
        const imgName = `${name.replace(' ', '_')}_thumb`
        console.log(imgName)
        const ibbResponse = await compressAndUploadToIbb(originalImg[0], imgName)
        if (!ibbResponse) {
            throwAlert('Algo deu errado. Tente novamente mais tarde.', 'danger')
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
                ibbResponse.data.image.url,
                null,
                user.id,
                true
            )
            const send = await fetch('/api/projects/add-company', {
                method: 'POST',
                body: JSON.stringify({company: newCompany}),
                headers: {authorization: process.env.NEXT_PUBLIC_API_TOKEN as string}
            }).then(response => {
                if (!response.ok) return false
                else return true
            })
            if (!send) {
                throwAlert('Algo deu errado. Tente novamente mais tarde.', 'danger')
            } else {
                throwAlert('Construtora cadastrada com sucesso.', 'success')
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
            <div className={style.Body}>
                <div className={style.Form}>
                    <Alert handleShow={setAlertShow}
                        show={alertShow}
                        message={alertMessage}
                        type={alertType} />
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
                        <span>Imagem de Capa:</span>
                        <input max={1} onChange={(e) => setOriginalImg(e.target.files)} id="fileInput" type="file" accept="image/*" />
                    </div>
                    <div className={style.SendButton}>
                        <button id="sendBt" onClick={() => register()} className="btn btn-warning">Enviar</button>
                    </div>
                </div>
            </div>
        </> : null
    )
}