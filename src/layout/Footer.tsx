import Image from "next/image"
import Container from "./Container"

const Footer = () => {
    return (
        <div className="Footer">
            <Container>
                <div className="RedesSociais">
                    <Image priority src={'/media/instagram.png'} width={200} height={200} alt="" />
                    <Image priority src={'/media/linkedin.png'} width={200} height={200} alt="" />
                    <Image priority src={'/media/github.png'} width={200} height={200} alt="" />
                </div>
            </Container>
        </div>
    )
}
export default Footer