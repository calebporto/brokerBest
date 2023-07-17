import { AuthContext } from "@/contexts/AuthContext"
import TitleBar from "@/layout/TitleBar"
import TopNavbar from "@/layout/TopNavbar"
import { useRouter } from "next/router"
import { LegacyRef, useContext, useEffect, useRef, useState } from "react"
import style from '../../../styles/Form.module.css'
import Head from "next/head"
import IMask from "imask"
import Alert, { _throwAlert } from "@/layout/Alert"

export default () => {
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
    const context = useContext(AuthContext)
    const { session, user } = context
    const router = useRouter()
    const [showPage, setShowPage] = useState(false)
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')

    var sendBt: HTMLButtonElement | null;
    var fileInput: HTMLInputElement | null;

    if (session === undefined) return
    if (session == null) {
        router.push('/entrar')
    } else if (!session.user.is_authenticated) {
        router.push('/entrar/auth-email')
    } else if (!user.is_complete_data) {
        router.push('/auth/login-social')
    } else {
        if (!showPage) {
            setShowPage(true)
        }
    }
    
    useEffect(() => {
        if (showPage) {
            sendBt = document.querySelector('#sendBt') as HTMLButtonElement
            fileInput = document.querySelector('#fileInput') as HTMLInputElement

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

    function throwAlert(message:string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }
    
    function register() {
        setAlertShow(false)
        // if (!name) {
        //     throwAlert('Nome inválido.', 'danger')
        //     return
        // }
        // if (!description || description.length < 20) {
        //     throwAlert('Descreva com mais detalhes a construtora.', 'danger')
        //     return
        // }
        // if (!email || email.indexOf('@') == -1 || email.indexOf('.') == -1 || email.length < 8) {
        //     throwAlert('E-mail inválido.', 'danger')
        //     return
        // }
        // if (!tel || tel.length < 14 && tel.length > 15) {
        //     throwAlert('Telefone inválido.', 'danger')
        //     return
        // }
        // if (!address) {
        //     throwAlert('Endereço inválido.', 'danger')
        //     return
        // }
        // if (!num) {
        //     throwAlert('Número inválido.', 'danger')
        //     return
        // }
        // if (!district) {
        //     throwAlert('Bairro inválido.', 'danger')
        //     return
        // }
        // if (!city) {
        //     throwAlert('Cidade inválida.', 'danger')
        //     return
        // }
        // if (!uf) {
        //     throwAlert('UF inválido.', 'danger')
        //     return
        // }
        if (fileInput?.files?.length as number < 1) {
            throwAlert('Selecione uma imagem.', 'danger')
            return
        }
        if (fileInput?.files) {
            console.log(fileInput.files)
        }
        if (sendBt) {
            sendBt.innerHTML = `
            <div class="spinner-border text-dark" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            `
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
                        <input onChange={(e) => setName(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.LgInput}>
                        <span>Descrição:</span>
                        <textarea onChange={(e) => setDescription(e.target.value)} maxLength={500} name="" id="" rows={4}></textarea>
                    </div>
                    <div className={style.MdInput}>
                        <span>Email:</span>
                        <input onChange={(e) => setEmail(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Telefone:</span>
                        <input onChange={(e) => setTel(e.target.value)} id="tel" maxLength={15} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Endereço:</span>
                        <input onChange={(e) => setAddress(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.SmInput + ' ' + style.Right}>
                        <span>Número:</span>
                        <input onChange={(e) => setNum(e.target.value)} id="num" maxLength={6} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Complemento:</span>
                        <input onChange={(e) => setComplement(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Bairro:</span>
                        <input onChange={(e) => setDistrict(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Cidade:</span>
                        <input onChange={(e) => setCity(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.SmInput + ' ' + style.Right}>
                        <span>UF:</span>
                        <input onInput={(e) => setUf(e.currentTarget.value)} onChange={(e) => setUf(e.target.value)} id="uf" maxLength={2} type="text" />
                    </div>
                    <div className={style.ImageInput}>
                        <span>Imagem de Capa:</span>
                        <input id="fileInput" type="file" accept=".jpg, .jpeg, .png"/>
                    </div>
                    <div className={style.SendButton}>
                        <button id="sendBt" onClick={() => register()} className="btn btn-warning">Enviar</button>
                    </div>
                </div>
            </div>
        </> : null
    )
}