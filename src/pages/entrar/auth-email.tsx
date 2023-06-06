import AuthEmail from "@/pageComponents/AuthEmail"
import { useSession } from "next-auth/react"
import Router from "next/router"
import { useEffect } from "react"


const AuthEmailPage = () => {
    const {data: session} = useSession() as any
    useEffect(() => {
        if (!session) {
            Router.push('/entrar')
        } else {
            if (session.is_authenticated) {
                Router.push('/painel')
            }
        }
    }, [session])
    return (
        <>
            <AuthEmail></AuthEmail>
        </>
    )
}
export default AuthEmailPage