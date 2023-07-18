import { useContext, useEffect, useState } from 'react'
import style from '../../../styles/Form.module.css'
import Head from 'next/head'
import TopNavbar from '@/layout/TopNavbar'
import { AuthContext } from '@/contexts/AuthContext'
import TitleBar from '@/layout/TitleBar'
import Alert, { _throwAlert } from '@/layout/Alert'
import { useRouter } from 'next/router'
import IMask from 'imask'
import { compressAndUploadToIbb, parseYoutubeLink } from '@/helpers/helpers'
import { Project } from '@/classes'
import Modal from '@/layout/Modal'

export default () => {
    const [showPage, setShowPage] = useState(false)
    const router = useRouter()
    const context = useContext(AuthContext)
    const { session, user } = context
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [deliveryDate, setDeliveryDate] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [num, setNum] = useState<string>('')
    const [complement, setComplement] = useState<string>('')
    const [district, setDistrict] = useState<string>('')
    const [zone, setZone] = useState<string>('')
    const [city, setCity] = useState<string>('')
    const [uf, setUf] = useState<string>('')
    const [latitude, setLatitude] = useState<string>('')
    const [longitude, setLongitude] = useState<string>('')
    const [status, setStatus] = useState<string>('')
    const [thumb, setThumb] = useState<FileList | null>()
    const [images, setImages] = useState<FileList | null>()
    const [video, setVideo] = useState('')
    const [link, setLink] = useState('')
    const [book, setBook] = useState('')
    const [sending, setSending] = useState(false)
    const [showWaitingModal, setShowWaitingModal] = useState(false)

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

    function throwAlert(message: string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }

    useEffect(() => {
        if (showPage) {

            let deliveryDate = document.getElementById('deliveryDate') as HTMLInputElement
            let deliveryDateOptions = {
                mask: '00/00/0000'
            };
            let deliveryDateMask = IMask(deliveryDate, deliveryDateOptions);

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

            let latitude = document.getElementById('latitude') as HTMLInputElement
            let latitudeOptions = {
                mask: Number,
                min: 0,
                scale: 10,
                radix: '.',
                mapToRadix: [',']
                // prepare: function (str: string) {
                //     return str.toUpperCase();
                // }
            };
            let latitudeMask = IMask(latitude, latitudeOptions);

            let longitude = document.getElementById('longitude') as HTMLInputElement
            let longitudeOptions = {
                mask: Number,
                min: 0,
                scale: 10,
                radix: '.',
                mapToRadix: [',']
                // prepare: function (str: string) {
                //     return str.toUpperCase();
                // }
            };
            let longitudeMask = IMask(longitude, longitudeOptions);
        }
    }, [showPage])

    useEffect(() => {
        if (sending) setShowWaitingModal(true)
        else setShowWaitingModal(false)
    }, [sending])

    async function register() {
        setAlertShow(false)
        if (!name) {
            throwAlert('Nome inválido.', 'danger')
            return
        }
        if (!description || description.length < 20) {
            throwAlert('Descreva com mais detalhes o empreendimento.', 'danger')
            return
        }
        if (
            !deliveryDate || deliveryDate.length < 10
            || parseInt(deliveryDate.substring(0, 2)) > 31
            || parseInt(deliveryDate.substring(3, 5)) > 12
            || deliveryDate.substring(3, 5) == '02' && parseInt(deliveryDate.substring(0, 2)) > 29
            || parseInt(deliveryDate.substring(6, 10)) < 2023
            || parseInt(deliveryDate.substring(6, 10)) > 2100
        ) {
            console.log(parseInt(deliveryDate.substring(0, 2)))
            console.log(parseInt(deliveryDate.substring(3, 5)))
            console.log(parseInt(deliveryDate.substring(6, 10)))
            throwAlert('Data de entrega inválida.', 'danger')
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
        if (!zone) {
            throwAlert('Selecione uma zona.', 'danger')
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
        if (!latitude) {
            throwAlert('Latitude inválida.', 'danger')
            return
        }
        if (!longitude) {
            throwAlert('Longitude inválida.', 'danger')
            return
        }
        if (!status) {
            throwAlert('Selecione o status do empreendimento.', 'danger')
            return
        }
        if (!thumb || thumb.length < 1) {
            throwAlert('Selecione uma capa.', 'danger')
            return
        }
        if (!images || images.length < 1) {
            throwAlert('Selecione ao menos uma imagem para o empreendimento.', 'danger')
            return
        }
        if (images.length > 10) {
            throwAlert('Selecione no máximo 10 imagens.', 'danger')
            return
        }
        setSending(true)
        var thumbImg = ''
        try {
            const thumbName = `${name.replace(" ", "_")}_project_thumb`
            const thumbResponse = await compressAndUploadToIbb(thumb[0], thumbName)
            thumbImg = thumbResponse.data.image.url
        } catch (error) {
            console.log(error)
        }

        const imageLinks = []
        for (let i = 0; i < images.length; i++) {
            let img = ''
            try {
                let imgName = `${name.replace(" ", "_")}_project_image_${i.toString()}`
                const imageResponse = await compressAndUploadToIbb(images[i], imgName)
                img = imageResponse.data.image.url
            } catch (error) {
                console.log(error)
            }
            imageLinks.push(img)
        }

        const send = new Project(
            null,
            user.id,
            parseInt(router.query.companyId as string),
            name,
            description,
            new Date(deliveryDate),
            address,
            num,
            complement,
            district,
            zone,
            city,
            uf,
            null,
            parseFloat(latitude),
            parseFloat(longitude),
            status,
            thumbImg,
            imageLinks,
            [parseYoutubeLink(video)],
            link,
            book
        )

        const response = await fetch('/api/projects/add-project', {
            method: 'POST',
            body: JSON.stringify({ project: send })
        }).then(res => {
            if (!res.ok) {
                setSending(false)
                throwAlert('Aldo deu errado. Tente novamente mais tarde.', 'danger')
                return false
            }
            else {
                setSending(false)
                throwAlert('Empreendimento registrado com sucesso.', 'success')
                return true
            }
        })
    }

    return (
        showPage ? <>
            <Head>
                <title>Broker Best</title>
                <meta name="description" content="Broker Best teste" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Modal show={showWaitingModal} shortModal={true} setShow={setShowWaitingModal} title={'Aguarde'}>
                <span>Aguarde enquanto é feito o upload das imagens. Isso pode levar
                    mais de um minuto...
                </span>
                <br />
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Modal>
            <TopNavbar contextUser={context}></TopNavbar>
            <TitleBar title={'Adicionar Empreendimento'}></TitleBar>
            <div className={style.Body}>
                <div className={style.Form}>
                    <Alert handleShow={setAlertShow}
                        show={alertShow}
                        message={alertMessage}
                        type={alertType} />
                    <div className={style.LgInput}>
                        <span>Nome do Empreendimento:</span>
                        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.LgInput}>
                        <span>Descrição:</span>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} name="" id="" rows={4}></textarea>
                    </div>
                    <div className={style.SmInput}>
                        <span>Data de Entrega:</span>
                        <input id='deliveryDate' value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
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
                        <span>Zona:</span>
                        <select onChange={(e) => setZone(e.target.value)} name="zona" id="zona">
                            <option value="" disabled selected>-- Selecione --</option>
                            <option value="norte">Zona Norte</option>
                            <option value="sul">Zona Sul</option>
                            <option value="leste">Zona Leste</option>
                            <option value="oeste">Zona Oeste</option>
                            <option value="centro">Centro</option>
                        </select>
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Cidade:</span>
                        <input value={city} onChange={(e) => setCity(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.SmInput}>
                        <span>UF:</span>
                        <input value={uf} onInput={(e) => setUf(e.currentTarget.value)} onChange={(e) => setUf(e.target.value)} id="uf" maxLength={2} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Status da construção:</span>
                        <select onChange={(e) => setStatus(e.target.value)} name="status" id="status">
                            <option value='' selected disabled> -- Selecione --</option>
                            <option value='pronto'>Pronto</option>
                            <option value='construindo'>Em construção</option>
                        </select>
                    </div>
                    <div className={style.MdInput}>
                        <span>Latitude (Essencial para buscar no mapa):</span>
                        <input id="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} maxLength={20} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Longitude (Essencial para buscar no mapa):</span>
                        <input id="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} maxLength={20} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Link do Youtube:</span>
                        <input value={video} onChange={(e) => setVideo(e.target.value)} id="uf" maxLength={100} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Link do Drive Original da Imobiliária:</span>
                        <input value={link} onChange={(e) => setLink(e.target.value)} id="uf" maxLength={100} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Link do Book em PDF da Imobiliária:</span>
                        <input value={book} onChange={(e) => setBook(e.target.value)} id="uf" maxLength={100} type="text" />
                    </div>
                    <div className={style.ImageInput}>
                        <span>Imagem de Capa:</span>
                        <input max={1} onChange={(e) => setThumb(e.target.files)} id="thumbInput" type="file" accept="image/*" />
                    </div>
                    <div className={style.ImageInput}>
                        <span>Imagens do Empreendimento (Máximo: 10):</span>
                        <input multiple onChange={(e) => setImages(e.target.files)} id="imagesInput" type="file" accept="image/*" />
                    </div>
                    <div className={style.SendButton}>
                        <button id="sendBt" onClick={() => register()} className="btn btn-warning">
                            {!sending ? 'Enviar' : (
                                <div className="spinner-border text-dark" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </> : null
    )
}