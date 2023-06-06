import style from "../styles/Cadastrar.module.css"
import Alert, {_throwAlert} from "./Alert"
import { useEffect, useState } from "react"
import IMask from "imask"
import { useSession } from "next-auth/react"
import Router from 'next/router'

class newUser {
    nome: string
    email: string
    tel: string
    cep: string
    endereco: string
    num: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    password: string
    provider: number

    constructor(nome: string, email: string, tel: string, cep: string, endereco: string,
        num: string, complemento: string, bairro: string, cidade: string, uf: string, password: string, provider: number ) {
        this.nome = nome;
        this.email = email;
        this.tel = tel;
        this.cep = cep;
        this.endereco = endereco;
        this.num = num;
        this.complemento = complemento;
        this.bairro = bairro;
        this.cidade = cidade;
        this.uf = uf;
        this.password = password;
        this.provider = provider
    }
}
const CadastrarBox = () => {
    const { data: session } = useSession() as any
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    const [alertClick, setAlertClick] = useState('')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [tel, setTel] = useState('')
    const [cep, setCep] = useState('')
    const [endereco, setEndereco] = useState('')
    const [num, setNum] = useState('')
    const [complemento, setComplemento] = useState('')
    const [bairro, setBairro] = useState('')
    const [cidade, setCidade] = useState('')
    const [uf, setUf] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    useEffect(() => {
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
    }, [])
    useEffect(() => {
        console.log(session)
        if (session) {
            if (!session.is_authenticated) {
                Router.push('/entrar/auth-email')
            } else{
                Router.push('/painel')
            }
        }
    }, [session])
    
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
        //Limpa valores do formulário de cep.
        // let endereco = document.getElementById('endereco') as HTMLInputElement
        // let bairro = document.getElementById('ibge') as HTMLInputElement
        // let cidade = document.getElementById('cidade') as HTMLInputElement
        // let uf = document.getElementById('uf') as HTMLInputElement
        // [endereco, bairro, cidade, uf].forEach(item => item.value = '')
        setEndereco('')
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

                fetch('https://viacep.com.br/ws/'+ cep +'/json/')
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
    function throwAlert(message:string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }
    function passwordValidator(password: string) {
        function repeatDetector(password: string) {
            for(let i = 1; i < password.length; i++){
                if (password[i] != password[i - 1]) {
                    return false
                }
            }
            return true
        }
        function sequencialDetector(password: string) {
            for(let i = 0; i < password.length; i++){
                if (parseInt(password[i]).toString() == 'NaN') {
                    return false
                }
                if (i > 0 && parseInt(password[i]) - 1 != parseInt(password[i - 1])) {
                    return false
                }
            }
            return true
        }
        let message;
        if (password.length < 8) {
            message = 'Sua senha deve conter ao menos 8 caracteres.'
            return {
                status: false,
                message: message
            }
        }
        if (sequencialDetector(password)) {
            message = 'Você não pode usar uma senha com todos os caracteres sequenciais.'
            return {
                status: false,
                message: message
            }
        }
        if (repeatDetector(password)) {
            message = 'Você não pode usar uma senha com todos os caracteres repetidos.'
            return {
                status: false,
                message: message
            }
        }
        return {
            status: true,
            message: ''
        }
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
            console.log(uf)
            throwAlert('UF inválido.', 'danger')
            return
        }
        if (!password) {
            throwAlert('Escolha uma senha.', 'danger')
            return
        }
        if (!password2) {
            throwAlert('Confirme sua senha.', 'danger')
            return
        }
        if (password != password2) {
            throwAlert('As senhas não conferem. Preencha novamente.', 'danger')
            setPassword('')
            setPassword2('')
            return
        }
        let checkPassword = passwordValidator(password)
        if (!checkPassword.status) {
            throwAlert(checkPassword.message, 'danger')
            return
        }
        let send = new newUser(
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
            password,
            1
        )
        fetch(`/api/user-register`, {
            method: 'POST',
            body: JSON.stringify(send),
            headers: {
                'authorization': process.env.NEXT_PUBLIC_API_TOKEN as string
            }
        })
        .then(response => response.json())
        .then(data => {
            throwAlert('Cadastro efetuado com sucesso. Clique aqui para entrar.', 'success')
            setAlertClick('/entrar')
        })
    }
    return (
        <div id="loginBox" className={style.CadastrarBox}>
            <Alert message={alertMessage} type={alertType} show={alertShow} handleShow={setAlertShow} clickAction={alertClick} />
            <div className={style.Title}>
                <p>Cadastrar-se</p>
            </div>
            <div className={style.Inputs}>
                <div className={style.Input}>
                    <input type="text" id="nome" placeholder="Nome" maxLength={50} value={nome} onChange={(e) => setNome(e.target.value)}/>
                </div>
                <div className={`${style.Input} ${style.Medium}`}>
                    <input type="text" id="email" placeholder="E-mail" maxLength={50} value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className={`${style.Input} ${style.Medium}`}>
                    <input type="text" id="tel" placeholder="Telefone" maxLength={50} value={tel} onChange={(e) => setTel(e.target.value)}/>
                </div>
                <div className={`${style.Input} ${style.Medium}`}>
                    <input type="text" id="cep" placeholder="CEP" maxLength={50} value={cep} onBlur={() => findCep(cep)} onChange={(e) => setCep(e.target.value)}/>
                </div>
                <div className={`${style.Input} ${style._3_4}`}>
                    <input type="text" id="endereco" placeholder="Endereço" maxLength={50} value={endereco} onChange={(e) => setEndereco(e.target.value)}/>
                </div>
                <div className={`${style.Input} ${style._1_4}`}>
                    <input type="text" id="num" placeholder="Nº" maxLength={50} value={num} onChange={(e) => setNum(e.target.value)}/>
                </div>
                <div className={`${style.Input} ${style.Medium}`}>
                    <input type="text" id="complemento" placeholder="Complemento" maxLength={50} value={complemento} onChange={(e) => setComplemento(e.target.value)}/>
                </div>
                <div className={`${style.Input} ${style.Medium}`}>
                    <input type="text" id="bairro" placeholder="Bairro" maxLength={50} value={bairro} onChange={(e) => setBairro(e.target.value)} />
                </div>
                <div className={`${style.Input} ${style._3_4}`}>
                    <input type="text" id="cidade" placeholder="Cidade" maxLength={50} value={cidade} onChange={(e) => setCidade(e.target.value)}/>
                </div>
                <div className={`${style.Input} ${style._1_4}`}>
                    <input type="text" id="uf" placeholder="UF" maxLength={2} value={uf} onInput={(e) => setUf(e.currentTarget.value)} onChange={(e) => setUf(e.target.value)}/>
                </div>
                <div className={`${style.Input} ${style.Medium}`}>
                    <input type="password" id="password" placeholder="Senha" maxLength={50} value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className={`${style.Input} ${style.Medium}`}>
                    <input type="password" id="password2" placeholder="Confirme a senha" maxLength={50} value={password2} onChange={(e) => setPassword2(e.target.value)}/>
                </div>
                <p className={ style.PasswordInstructions}>
                    <strong>Instruções:</strong>
                    <br />
                    - Sua senha deve conter ao menos 8 dígitos.
                    <br />
                    - Não use repetições como 00000000 ou aaaaaaaa por exemplo.
                    <br />
                    - Não use números sequenciais como 12345678.
                    <br />
                    - Evite datas de aniversário.
                    <br />
                    - Misture caracteres especiais como !@#$%&*, números, letras maiúsculas e minúsculas.

                </p>
                <div className={style.Button}>
                    <button onClick={() => register()}>Enviar</button>
                </div>
            </div>
        </div>
    )
}
export default CadastrarBox