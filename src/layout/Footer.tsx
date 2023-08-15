import Image from "next/image"
import Container from "./Container"

const Footer = () => {
    return (
        <div className="Footer">
            <Container>
                <div className="RedesSociais">
                    <Image onClick={() => window.open('https://instagram.com/leo.broker')} priority src={'/media/instagram.png'} width={200} height={200} alt="" />
                    <Image onClick={() => window.open('https://www.linkedin.com/in/leo-almeida-599863149/')} priority src={'/media/linkedin.png'} width={200} height={200} alt="" />
                </div>
                <div className="Info">
                    <a href="/politica-de-privacidade.pdf">Política de Privacidade</a>
                    <a href="/termos-e-condicoes-de-uso.pdf">Termos e Condições de Uso</a>
                </div>
                <div className="Copy">
                    <span>&copy; Broker Best - Todos os direitos reservados.</span>
                    <span> Desenvolvido por Caléb Rangel Porto - RJ</span>
                </div>
            </Container>
        </div>
    )
}
export default Footer