import { AuthContext } from "@/contexts/AuthContext";
import { checkContextUpdate } from "@/helpers/helpers";
import CadastrarBox from "@/layout/CadastrarBox";
import TopNavbar from "@/layout/TopNavbar";
import { useContext } from "react";

export default function CompletarCadastro() {
    const { ...context } = useContext(AuthContext)

    return (
        <>
            <TopNavbar entrarBt={false} cadastrarBt={false} perfilBt={true} fixed={false} contextUser={context} />
            <CadastrarBox></CadastrarBox>
        </>
    )
}