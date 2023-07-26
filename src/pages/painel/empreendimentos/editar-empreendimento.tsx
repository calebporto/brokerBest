import { AuthContext } from "@/contexts/AuthContext"
import TitleBar from "@/layout/TitleBar"
import TopNavbar from "@/layout/TopNavbar"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import style from '../../../styles/Form.module.css'
import Head from "next/head"
import IMask from "imask"
import Alert, { _throwAlert } from "@/layout/Alert"
import { compressAndUploadToIbb, compressFile, parseYoutubeLink, uploadToIbb } from "@/helpers/helpers"
import EmpreendimentosBar from "@/layout/EmpreendimentosBar"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import ThumbEdit from "@/layout/ThumbEdit"
import { Project, ProjectData, ProjectView } from "@/helpers/interfaces"
import { Project as ProjectClass } from "@/classes"
import Modal from "@/layout/Modal"

export const getServerSideProps: GetServerSideProps<{ project: ProjectView | null }> = async (context) => {
    try {
        const session = await getServerSession(context.req, context.res, authOptions)
        if (!session || session.user.is_admin == false) {
            return { props: { project: null } }
        }
        const getproject = async () => {
            let url = `${process.env.API_URL}/project-services/get-project-by-id?id=${context.query.id}
            `
            return await fetch(url, {
                headers: {
                    'authenticator': process.env.AUTH_KEY as string
                }
            })
                .then(response => {
                    if (!response.ok) return null
                    else return response.json().then((data: ProjectView) => {
                        return data
                    })
                })
        }
        const project = await getproject()
        if (project != null) {
            return { props: { project } }
        } else {
            return { props: { project: null } }
        }
    } catch (error) {
        console.log(error)
        return { props: { project: null } }
    }
}

export default function AddConstrutora({ project }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const [name, setName] = useState<string | null>('')
    const [description, setDescription] = useState<string | null>('')
    const [deliveryDate, setDeliveryDate] = useState('')
    const [address, setAddress] = useState<string | null>('')
    const [num, setNum] = useState<string | null>('')
    const [complement, setComplement] = useState<string | null>('')
    const [district, setDistrict] = useState<string | null>('')
    const [zone, setZone] = useState<string | null>('')
    const [city, setCity] = useState<string | null>('')
    const [uf, setUf] = useState<string | null>('')
    const [latitude, setLatitude] = useState<string | null>('')
    const [longitude, setLongitude] = useState<string | null>('')
    const [status, setStatus] = useState<string | null>('')
    const [currentThumb, setCurrentThumb] = useState<string>('')
    const [fileThumb, setFileThumb] = useState<FileList | null>(null)
    const [compressedThumb, setCompressedThumb] = useState<File | null>(null)
    const [fileImages, setFileImages] = useState<FileList | null>(null)
    const [video, setVideo] = useState<string>('')
    const [link, setLink] = useState<string>('')
    const [newBook, setNewBook] = useState<FileList | null>(null)
    const [imgLoading, setImgLoading] = useState(false)
    const [showPage, setShowPage] = useState(false)
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    const context = useContext(AuthContext)
    const { session, user, setSystemMessage } = context
    const [sending, setSending] = useState(false)
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
                    if (!project) {
                        setSystemMessage('Algo deu errado. Tente novamente mais tarde.')
                        router.push('/painel/empreendimentos-admin')
                    } else {
                        setName(project?.project?.name ? project?.project?.name : '')
                        setDescription(project?.project?.description ? project?.project?.description : '')
                        setDeliveryDate(project?.project?.delivery_date ? new Date(project?.project?.delivery_date as Date).toLocaleDateString('pt-BR') : '')
                        setAddress(project?.project?.address ? project?.project?.address : '')
                        setNum(project?.project?.num ? project?.project?.num : '')
                        setComplement(project?.project?.complement ? project?.project?.complement : '')
                        setDistrict(project?.project?.district ? project?.project?.district : '')
                        setCity(project?.project?.city ? project?.project?.city : '')
                        setUf(project?.project?.uf ? project?.project?.uf : '')
                        setLatitude(project?.project?.latitude ? project?.project?.latitude.toString().replace(',', '.') : '')
                        setLongitude(project?.project?.longitude ? project?.project?.longitude.toString().replace(',', '.') : '')
                        setVideo(project?.project?.videos && project?.project?.videos.length > 0 ? project?.project?.videos[0] : '')
                        setLink(project?.project?.link && project?.project?.link.length > 0 ? project?.project?.link[0] : '')
                        setCurrentThumb(project?.project?.thumb ? project?.project?.thumb : '')

                        //setCurrentImage(project?.project?.thumb ? project?.project?.thumb : '')
                        setShowPage(true)
                    }
                }
            }
        }
    }, [session, user, project])

    //Visualização de imagem
    useEffect(() => {
        if (!fileThumb) return;
        setImgLoading(true)
        const compress = async () => {
            const compressed = await compressFile(fileThumb[0])
            const url = URL.createObjectURL(compressed);
            () => url && URL.revokeObjectURL(url);
            setCurrentThumb(url);
            setCompressedThumb(compressed)
            setImgLoading(false)
        }
        compress()
            .catch(console.error);
    }, [fileThumb]);

    useEffect(() => {
        if (showPage) {
            let deliveryDate = document.getElementById('deliveryDate') as HTMLInputElement
            let deliveryDateOptions = {
                mask: '00/00/0000'
            };
            let deliveryDateMask = IMask(deliveryDate, deliveryDateOptions);

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
                min: -90,
                max: 90,
                scale: 6,
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
                min: -180,
                max: 180,
                scale: 6,
                radix: '.',
                mapToRadix: [',']
                // prepare: function (str: string) {
                //     return str.toUpperCase();
                // }
            };
            let longitudeMask = IMask(longitude, longitudeOptions);

            if (project?.project?.zone) {
                var zoneSelect = document.querySelector('#zona') as HTMLSelectElement
                for (let i = 0; i < zoneSelect.options.length; i++) {
                    if (zoneSelect.options[i].value == project?.project?.zone) {
                        zoneSelect.options[i].selected = true
                        setZone(project?.project?.zone)
                    }
                }
            }
            if (project?.project?.status) {
                var statusSelect = document.querySelector('#status') as HTMLSelectElement
                for (let i = 0; i < statusSelect.options.length; i++) {
                    if (statusSelect.options[i].value == project?.project?.status) {
                        statusSelect.options[i].selected = true
                        setStatus(project?.project?.status)
                    }
                }
            }
        }
    }, [showPage])

    function throwAlert(message: string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }
    function clean() {
        setName('')
        setDescription('')
        setDeliveryDate('')
        setAddress('')
        setNum('')
        setComplement('')
        setDistrict('')
        setZone('')
        setCity('')
        setUf('')
        setLatitude('')
        setLongitude('')
        setStatus('')
        setVideo('')
        setLink('')
        setVideo('')
        setFileThumb(null)
        setFileImages(null)
        setCompressedThumb(null)

        var imagesInput = document.getElementById('imagesInput') as HTMLInputElement
        imagesInput.value = ''
        imagesInput.files = null

        var bookInput = document.getElementById('bookInput') as HTMLInputElement
        bookInput.value = ''
        bookInput.files = null

        var selectZone = document.getElementById('zona') as HTMLSelectElement
        selectZone.selectedIndex = 0

        var selectStatus = document.getElementById('status') as HTMLSelectElement
        selectStatus.selectedIndex = 0
    }
    async function register() {
        const getS3PresignedURL = async (key: string) => {
            return await fetch(`/api/projects/get-s3-presigned-url?key=${key}`).then(response => {
                if (!response.ok) return null
                else {
                    return response.json().then(data => data)
                }
            })
        }
        const bookUpload = async (file: File, presignedURLData: any) => {
            const upload = await fetch(presignedURLData.url, {
                method: 'PUT',
                body: file,
                headers: { "Content-Type": 'application/pdf' }
            })
            if (upload.ok) {
                console.log('Uploaded successfully!')
                return true
            } else {
                console.error('Upload failed.')
                return false
            }
        }
        setAlertShow(false)
        if (!name) {
            throwAlert('Nome inválido.', 'danger')
            return
        }
        if (!description || description.length < 20) {
            throwAlert('Descreva com mais detalhes a construtora.', 'danger')
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

        setShowWaitingModal(true)
        var newThumb;
        if (fileThumb && fileThumb?.length > 0) {
            let ibbResponse;
            const thumbName = `${name.replace(' ', '_')}_thumb`
            ibbResponse = await compressAndUploadToIbb(fileThumb[0], thumbName)
            if (ibbResponse) {
                newThumb = ibbResponse.data.image.url
            } else {
                throwAlert('Algo deu errado com o upload da capa. Tente novamente mais tarde.', 'danger')
                setShowWaitingModal(false)
                return
            }
        }
        var newImgs = []
        if (fileImages && fileImages.length > 0) {
            for (let i = 0; i < fileImages.length; i++) {
                let ibbResponse;
                const imgName = `${name.replace(' ', '_')}_image_${i.toString()}`
                ibbResponse = await compressAndUploadToIbb(fileImages[i], imgName)
                if (ibbResponse) newImgs.push(ibbResponse.data.image.url)
            }
            if (newImgs.length == 0) {
                throwAlert('Algo deu errado com o upload das imagens. Tente novamente mais tarde.', 'danger')
                setShowWaitingModal(false)
                return
            } else if (newImgs.length < fileImages.length) {
                throwAlert('Alguma das imagens não pode ser gravada. Verifique o arquivo e tente novamente.', 'warning')
            }
        }
        var bookKey;
        if (newBook && newBook.length > 0) {
            bookKey = `${name.trim().toLowerCase().replace(' ', '-')}.pdf`
            try {
                const presignedURL = await getS3PresignedURL(bookKey)
                const uploadStatus = await bookUpload(newBook[0], presignedURL)
                if (!uploadStatus) {
                    throwAlert('Algo deu errado com o upload do book. Tente novamente mais tarde.', 'danger')
                    setShowWaitingModal(false)
                    return
                }
            } catch (error) {
                console.log(error)
                throwAlert('Algo deu errado com o upload do book. Tente novamente mais tarde.', 'danger')
                setShowWaitingModal(false)
                return
            }
        }

        var data = new Date()
        data.setDate(parseInt(deliveryDate.substring(0, 2)))
        data.setMonth(parseInt(deliveryDate.substring(3, 5)))
        data.setFullYear(parseInt(deliveryDate.substring(6, 10)))
        const send = new ProjectClass(
            project?.project?.id as number,
            user.id,
            parseInt(router.query.companyId as string),
            name,
            description,
            data,
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
            newThumb,
            newImgs,
            video && video != '' ? [parseYoutubeLink(video)] : [],
            link,
            bookKey ? bookKey : null
        )

        const response = await fetch('/api/projects/project-edit', {
            method: 'POST',
            body: JSON.stringify({ project: send })
        }).then(res => {
            //clean()
            if (!res.ok) {
                setShowWaitingModal(false)
                throwAlert('Aldo deu errado. Tente novamente mais tarde.', 'danger')
                return false
            }
            else {
                setShowWaitingModal(false)
                setSystemMessage('Cadastro alterado com sucesso.')
                router.push('/painel/empreendimentos-admin')
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
                    <ThumbEdit imgLoading={imgLoading} link={currentThumb} setFile={setFileThumb}></ThumbEdit>
                    <div className={style.LgInput}>
                        <span>Nome da Construtora:</span>
                        <input value={name as string} onChange={(e) => setName(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.LgInput}>
                        <span>Descrição:</span>
                        <textarea value={description as string} onChange={(e) => setDescription(e.target.value)} maxLength={500} name="" id="" rows={4}></textarea>
                    </div>
                    <div className={style.SmInput}>
                        <span>Data de Entrega:</span>
                        <input id='deliveryDate' value={deliveryDate} onInput={(e) => setDeliveryDate(e.currentTarget.value)} onChange={(e) => setDeliveryDate(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
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
                        <input value={city as string} onChange={(e) => setCity(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.SmInput}>
                        <span>UF:</span>
                        <input value={uf as string} onInput={(e) => setUf(e.currentTarget.value)} onChange={(e) => setUf(e.target.value)} id="uf" maxLength={2} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Status da construção:</span>
                        <select onChange={(e) => setStatus(e.target.value)} name="status" id="status">
                            <option value='' selected disabled> -- Selecione --</option>
                            <option value='pronto'>Pronto</option>
                            <option value='em construção'>Em construção</option>
                            <option value='na planta'>Na planta</option>
                        </select>
                    </div>
                    <div className={style.MdInput}>
                        <span>Latitude (Essencial para buscar no mapa):</span>
                        <input id="latitude" value={latitude as string} onChange={(e) => setLatitude(e.target.value)} onInput={(e) => setLatitude(e.currentTarget.value)} maxLength={20} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Longitude (Essencial para buscar no mapa):</span>
                        <input id="longitude" value={longitude as string} onChange={(e) => setLongitude(e.target.value)} onInput={(e) => setLongitude(e.currentTarget.value)} maxLength={20} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Link do Youtube:</span>
                        <input value={video} onChange={(e) => setVideo(e.target.value)} maxLength={100} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Link do Drive Original da Imobiliária:</span>
                        <input value={link} onChange={(e) => setLink(e.target.value)} maxLength={100} type="text" />
                    </div>
                    <div className={style.ImageInput}>
                        <span>Escolher novo book:</span>
                        <input max={1} onChange={(e) => setNewBook(e.target.files)} id="bookInput" type="file" accept="application/pdf" />
                    </div>
                    <div className={style.ImageInput}>
                        <span>Escolher novas imagens para o empreendimento (Máximo: 10):</span>
                        <input multiple onChange={(e) => setFileImages(e.target.files)} id="imagesInput" type="file" accept="image/*" />
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