import { AuthContext } from "@/contexts/AuthContext"
import { Company } from "@/helpers/interfaces"
import Modal from "@/layout/Modal"
import TitleBar from "@/layout/TitleBar"
import TopNavbar from "@/layout/TopNavbar"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import Head from "next/head"
import { useRouter } from "next/router"
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types"
import { useContext, useEffect, useState } from "react"
import style from '../../../styles/Form.module.css'
import Alert, { _throwAlert } from "@/layout/Alert"
import IMask from "imask"
import { Property } from "@/classes"
import { compressAndUploadToIbb, parseYoutubeLink } from "@/helpers/helpers"
import EmpreendimentosBar from "@/layout/EmpreendimentosBar"

export const getServerSideProps: GetServerSideProps<{ company: Company | null }> = async (context) => {
    try {
        const session = await getServerSession(context.req, context.res, authOptions)
        if (!session) {
            return { props: { company: null } }
        }
        const getCompanyByProjectId = async () => {
            let url = `${process.env.API_URL}/project-services/get-company-by-id?projectId=${context.query.empreendimentoId}
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
        const company = await getCompanyByProjectId()
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

export default function AddImovel({ company }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [showPage, setShowPage] = useState(false)
    const router = useRouter()
    const context = useContext(AuthContext)
    const { session, user, setSystemMessage } = context
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    const [sending, setSending] = useState(false)
    const [showWaitingModal, setShowWaitingModal] = useState(false)
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [deliveryDate, setDeliveryDate] = useState<string>('')
    const [model, setModel] = useState('')
    const [measure, setMeasure] = useState('')
    const [size, setSize] = useState('')
    const [price, setPrice] = useState('')
    const [status, setStatus] = useState<string>('')
    const [thumb, setThumb] = useState<FileList | null>()
    const [images, setImages] = useState<FileList | null>()
    const [video, setVideo] = useState('')

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
            // let cepMask = IMask(cep, cepOptions)

            let price = document.getElementById('price') as HTMLInputElement
            let priceOptions = {
                mask: Number,
                min: 0,
                scale: 2,
                radix: ',',
                mapToRadix: ['.'],
                thousandsSeparator: '.'
                // prepare: function (str: string) {
                //     return str.toUpperCase();
                // }
            };
            let priceMask = IMask(price, priceOptions);

            let size = document.getElementById('size') as HTMLInputElement
            let sizeOptions = {
                mask: Number,
                min: 0,
                scale: 2,
                radix: ',',
                mapToRadix: ['.'],
                thousandsSeparator: '.'
                // prepare: function (str: string) {
                //     return str.toUpperCase();
                // }
            };
            let sizeMask = IMask(size, sizeOptions);
        }
    }, [showPage])

    useEffect(() => {
        if (sending) setShowWaitingModal(true)
        else setShowWaitingModal(false)
    }, [sending])

    useEffect(() => {
        if (session == null) {
            router.push('/entrar')
        } else if (session.user.is_authenticated == false) {
            router.push('/entrar/auth-email')
        } else if (user.is_complete_data == false) {
            router.push('/auth/login-social')
        } else {
            if (!showPage) {
                if (!user.id || !company) return
                if (company && company.admin_id == user.id) {
                    setShowPage(true)
                } else {
                    setSystemMessage('Você não tem permissão para essa ação.')
                    router.push('/painel')
                }
            }
        }

    }, [session, user])
    function clean() {
        setName('')
        setDescription('')
        setDeliveryDate('')
        setModel('')
        setMeasure('')
        setSize('')
        setPrice('')
        setStatus('')
        setThumb(null)
        setVideo('')
        setImages(null)

        var thumbInput = document.getElementById('thumbInput') as HTMLInputElement
        thumbInput.value = ''
        thumbInput.files = null
        
        var imagesInput = document.getElementById('imagesInput') as HTMLInputElement
        imagesInput.value = ''
        imagesInput.files = null
        
        var selectStatus = document.getElementById('status') as HTMLSelectElement
        selectStatus.selectedIndex = 0
    }
    function throwAlert(message: string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }
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

        if (!measure) {
            throwAlert('Insira as medidas do imóvel', 'danger')
            return
        }
        if (!size) {
            throwAlert('Insira a área total do imóvel.', 'danger')
            return
        }
        if (!status) {
            throwAlert('Selecione o status da construção.', 'danger')
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

        var delDate = new Date()
        delDate.setDate(parseInt(deliveryDate.substring(0, 2)))
        delDate.setMonth(parseInt(deliveryDate.substring(3, 5)))
        delDate.setFullYear(parseInt(deliveryDate.substring(6, 10)))
        
        const newProperty = new Property(
            null,
            company?.id as number,
            parseInt(router.query.empreendimentoId as string),
            name,
            description,
            delDate,
            model,
            measure,
            parseFloat(size.replace('.', '').replace(',', '.')),
            parseFloat(price.replace('.', '').replace(',', '.')),
            status,
            thumbImg,
            imageLinks,
            video && video != '' ? [parseYoutubeLink(video)] : []
        )

        const response = await fetch('/api/projects/add-property', {
            method: 'POST',
            body: JSON.stringify({ property: newProperty })
        }).then(res => {
            //clean()
            if (!res.ok) {
                setSending(false)
                throwAlert('Aldo deu errado. Tente novamente mais tarde.', 'danger')
                return false
            }
            else {
                setShowWaitingModal(false)
                setSystemMessage('Imóvel adicionado com sucesso')
                router.push('/painel/empreendimentos-admin')
                return true
            }
        })
        clean()
    }
    return (
        showPage ? <>
            <Head>
                <title>Broker Best</title>
                <meta name="description" content="Broker Best teste" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Modal show={showWaitingModal} shortModal={true} title={'Aguarde'}>
                <span>Aguarde enquanto é feito o upload das imagens. Isso pode levar
                    mais de um minuto...
                </span>
                <br />
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Modal>
            <TopNavbar contextUser={context}></TopNavbar>
            <TitleBar title={'Adicionar Imóvel'}></TitleBar>
            <EmpreendimentosBar backToAdmin={true}></EmpreendimentosBar>
            <div className={style.Body}>
                <div className={style.Form}>
                    <Alert handleShow={setAlertShow}
                        show={alertShow}
                        message={alertMessage}
                        type={alertType} />
                    <div className={style.LgInput}>
                        <span>Nome do Imóvel:</span>
                        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.LgInput}>
                        <span>Descrição:</span>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} name="" id="" rows={4}></textarea>
                    </div>
                    <div className={style.MdInput}>
                        <span>Data de Entrega:</span>
                        <input id='deliveryDate' value={deliveryDate} onInput={(e) => setDeliveryDate(e.currentTarget.value)} onChange={(e) => setDeliveryDate(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Medidas:</span>
                        <input value={measure} onChange={(e) => setMeasure(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Área Total (Metros):</span>
                        <input id="size" value={size} onChange={(e) => setSize(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Modelo - Opcional:</span>
                        <input value={model} onChange={(e) => setModel(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Status da construção:</span>
                        <select onChange={(e) => setStatus(e.target.value)} name="status" id="status">
                            <option value='' selected disabled> -- Selecione --</option>
                            <option value='pronto'>Pronto</option>
                            <option value='em construção'>Em construção</option>
                            <option value='na planta'>Na Planta</option>
                        </select>
                    </div>
                    <div className={style.MdInput + ' ' + style.Right}>
                        <span>Preço (R$) - Opcional:</span>
                        <input id="price" value={price} onChange={(e) => setPrice(e.target.value)} maxLength={50} type="text" />
                    </div>
                    <div className={style.MdInput}>
                        <span>Link do Youtube - Opcional:</span>
                        <input value={video} onChange={(e) => setVideo(e.target.value)} id="uf" maxLength={100} type="text" />
                    </div>
                    <div className={style.ImageInput}>
                        <span>Imagem de Capa:</span>
                        <input max={1} onChange={(e) => setThumb(e.target.files)} id="thumbInput" type="file" accept="image/*" />
                    </div>
                    <div className={style.ImageInput}>
                        <span>Imagens do Imóvel (Máximo: 10):</span>
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