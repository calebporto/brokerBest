import { AuthContext } from "@/contexts/AuthContext"
import { globalSignOut } from "@/helpers/helpers"
import WaitingWindow from "@/layout/WaitingWindow"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import style from '../../styles/Cadastrar.module.css'
import Alert, { _throwAlert } from "@/layout/Alert"
import IMask from "imask"
import TopNavbar from "@/layout/TopNavbar"
import { CompleteData } from "@/classes"


export default () => {
    const context = useContext(AuthContext)
    const { session, user, setSystemMessage } = context
    const [showForm, setShowForm] = useState(false)
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    const [alertClick, setAlertClick] = useState('')
    const [nome, setNome] = useState(user.name || '')
    const [email, setEmail] = useState(user.email || '')
    const [tel, setTel] = useState('')
    const [cep, setCep] = useState('')
    const [endereco, setEndereco] = useState('')
    const [num, setNum] = useState('')
    const [complemento, setComplemento] = useState('')
    const [bairro, setBairro] = useState('')
    const [cidade, setCidade] = useState('')
    const [uf, setUf] = useState('')
    const router = useRouter()

    useEffect(() => {
        console.log(user)
        if (user && user.name) {
            if (user.provider == 1) {
                setSystemMessage('Você já possui cadastro na plataforma. Use seu e-mail e senha.')
                globalSignOut(false)
                return
            } else {
                if (user.is_complete_data) {
                    router.push('/painel')
                    return
                } else {
                    if (!showForm) {
                        setShowForm(true)
                    }
                }
            }
        }

        if (user.name) {
            setNome(user.name)
        }
        if (user.email) {
            setEmail(user.email)
        }
    }, [user])

    useEffect(() => {
        if (showForm) {
            let telefone = document.getElementById('tel') as HTMLInputElement
            let telOptions = {
                mask: '(00) 00000-0000'
            };
            let telMask = IMask(telefone, telOptions);

            let cep = document.getElementById('cep') as HTMLInputElement
            let cepOptions = {
                mask: '00.000-000'
            };
            let cepMask = IMask(cep, cepOptions);

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
    }, [showForm])

    if (session === undefined) return
    else if (session == null) {
        router.push('/entrar')
    }

    function cepCallback(conteudo: any) {
        if (!("erro" in conteudo)) {
            setEndereco(conteudo.logradouro)
            setBairro(conteudo.bairro)
            setCidade(conteudo.localidade)
            setUf(conteudo.uf)
        } else {
            limpaFormulario()
            throwAlert('CEP não encontrado. Preencha os dados manualmente.', 'warning')
        }
    }
    function limpaFormulario() {
        setEndereco('')
        setBairro('')
        setCidade('')
        setUf('')
    }
    function limpaTodoFormulario() {
        setNome('')
        setEmail('')
        setTel('')
        setCep('')
        setEndereco('')
        setNum('')
        setComplemento('')
        setBairro('')
        setCidade('')
        setUf('')
    }
    function findCep(valor: string) {
        var cep = valor.replace(/\D/g, '')
        if (cep != '') {
            var validacep = /^[0-9]{8}$/
            if (validacep.test(cep)) {
                setEndereco('...')
                setBairro('...')
                setCidade('...')
                setUf('...')

                fetch('https://viacep.com.br/ws/' + cep + '/json/')
                    .then(response => response.json())
                    .then(data => cepCallback(data))
            } else {
                limpaFormulario()
                setAlertMessage('Formato de CEP inválido')
                setAlertShow(true)
            }
        } else {
            limpaFormulario()
        }
    }
    function throwAlert(message: string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }
    function register() {
        setAlertShow(false)
        if (!nome || nome.length < 10) {
            throwAlert('Nome inválido.', 'danger')
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
        if (!endereco) {
            throwAlert('Endereço inválido.', 'danger')
            return
        }
        if (!num) {
            throwAlert('Número inválido.', 'danger')
            return
        }
        if (!bairro) {
            throwAlert('Bairro inválido.', 'danger')
            return
        }
        if (!cidade) {
            throwAlert('Cidade inválida.', 'danger')
            return
        }
        if (!uf) {
            throwAlert('UF inválido.', 'danger')
            return
        }
        let send = new CompleteData(
            nome,
            email,
            tel,
            cep,
            endereco,
            num,
            complemento,
            bairro,
            cidade,
            uf,
            user.provider as number
        )
        let body = {
            data: send
        }
        fetch(`/api/complete-data`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'authorization': process.env.NEXT_PUBLIC_API_TOKEN as string
            }
        })
        .then(response => response.status)
        .then(status => {
            if (status == 200) {
                context.contextUpdate()
            } else {
                throwAlert('Erro no servidor. Tente novamente mais tarde.', 'danger')
            }
            limpaTodoFormulario()
            console.log(status)
            console.log(user)
        })
        return null
    }

    return (
        showForm ?
            <>
                <TopNavbar contextUser={context} perfilBt={true} />
                <div id="loginBox" className={style.CadastrarBox}>
                    <Alert message={alertMessage} type={alertType} show={alertShow} handleShow={setAlertShow} clickAction={alertClick} />
                    <div className={style.Title}>
                        <p>Cadastrar-se</p>
                    </div>
                    <div className={style.Inputs}>
                        <div className={style.Input}>
                            <input type="text" id="nome" placeholder="Nome" maxLength={50} value={nome} onChange={(e) => setNome(e.target.value)} />
                        </div>
                        <div className={`${style.Input} ${style.Medium}`}>
                            <input type="text" id="email" placeholder="E-mail" maxLength={50} value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className={`${style.Input} ${style.Medium}`}>
                            <input type="text" id="tel" placeholder="Telefone" maxLength={50} value={tel} onChange={(e) => setTel(e.target.value)} />
                        </div>
                        <div className={`${style.Input} ${style.Medium}`}>
                            <input type="text" id="cep" placeholder="CEP" maxLength={50} value={cep} onBlur={() => findCep(cep)} onChange={(e) => setCep(e.target.value)} />
                        </div>
                        <div className={`${style.Input} ${style._3_4}`}>
                            <input type="text" id="endereco" placeholder="Endereço" maxLength={50} value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                        </div>
                        <div className={`${style.Input} ${style._1_4}`}>
                            <input type="text" id="num" placeholder="Nº" maxLength={50} value={num} onChange={(e) => setNum(e.target.value)} />
                        </div>
                        <div className={`${style.Input} ${style.Medium}`}>
                            <input type="text" id="complemento" placeholder="Complemento" maxLength={50} value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                        </div>
                        <div className={`${style.Input} ${style.Medium}`}>
                            <input type="text" id="bairro" placeholder="Bairro" maxLength={50} value={bairro} onChange={(e) => setBairro(e.target.value)} />
                        </div>
                        <div className={`${style.Input} ${style._3_4}`}>
                            <input type="text" id="cidade" placeholder="Cidade" maxLength={50} value={cidade} onChange={(e) => setCidade(e.target.value)} />
                        </div>
                        <div className={`${style.Input} ${style._1_4}`}>
                            <input type="text" id="uf" placeholder="UF" maxLength={2} value={uf} onInput={(e) => setUf(e.currentTarget.value)} onChange={(e) => setUf(e.target.value)} />
                        </div>
                        <div className={style.Button}>
                            <button onClick={() => register()}>Enviar</button>
                        </div>
                    </div>
                </div>
            </>
            : <WaitingWindow></WaitingWindow>
    )
}