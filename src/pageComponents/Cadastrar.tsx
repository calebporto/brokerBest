import style from "../styles/Cadastrar.module.css"
import CadastrarBox from "@/layout/CadastrarBox"
import TopNavbar from "@/layout/TopNavbar"

const Cadastrar = () => {
    return (
        <>
            <TopNavbar entrarBt={true} cadastrarBt={false} perfilBt={false} fixed={false}></TopNavbar>
            <div className={style.Cadastrar}>
                <div className={style.EntrarBody}>
                    <CadastrarBox></CadastrarBox>
                </div>
            </div>
        </>
    )
}
export default Cadastrar