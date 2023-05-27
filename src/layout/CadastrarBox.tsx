import Link from "next/link"
import style from "../styles/Cadastrar.module.css"
import Image from "next/image"
import Alert from "./Alert"
import { useEffect, useState } from "react"
import Router from "next/router"
import { useSession } from "next-auth/react"
import IMask from "imask"

const CadastrarBox = () => {
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
    const { data: session } = useSession()
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
    function cepCallback(conteudo: any) {
        if (!("erro" in conteudo)) {
            setEndereco(conteudo.logradouro)
            setBairro(conteudo.bairro)
            setCidade(conteudo.localidade)
            setUf(conteudo.uf)
        } else {
            limpaFormulario()
            setAlertMessage('CEP não encontrado. Preencha os dados manualmente')
            setAlertShow(true)
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
    return (
        <div id="loginBox" className={style.LoginBox}>
            <Alert message={alertMessage} type={"danger"} show={alertShow} handleShow={setAlertShow} />
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
                    <input type="text" id="uf" placeholder="UF" maxLength={2} value={uf} onChange={(e) => setUf(e.target.value)}/>
                </div>
                <div className={`${style.Input} ${style.Medium}`}>
                    <input type="password" id="password" placeholder="Senha" maxLength={50} value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className={`${style.Input} ${style.Medium}`}>
                    <input type="password" id="password2" placeholder="Confirme a senha" maxLength={50} value={password2} onChange={(e) => setPassword2(e.target.value)}/>
                </div>
                <div className={style.Button}>
                    <button>Enviar</button>
                </div>
            </div>
        </div>
    )
}
export default CadastrarBox