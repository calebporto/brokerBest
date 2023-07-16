import { AuthContext } from "@/contexts/AuthContext"
import TitleBar from "@/layout/TitleBar"
import TopNavbar from "@/layout/TopNavbar"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getServerSession } from "next-auth"
import Head from "next/head"
import { useContext } from "react"
import { authOptions } from "../api/auth/[...nextauth]"
import { Company } from "@/helpers/interfaces"

export const getServerSideProps: GetServerSideProps<{companies: Array<Company> | null}> = async (context) => {
    try {
        const session = await getServerSession(context.req, context.res, authOptions)
        if (!session) {
            return { props : {companies: null} }
        }
        const getProjectById = async () => {
            let url = `${process.env.API_URL}/project-services/get-companies?userEmail=${session.user.email}
            `
            return await fetch(url, {
                headers: {
                    'authenticator': process.env.AUTH_KEY as string
                }
            })
            .then(response => {
                if (!response.ok) return null
                else return response.json().then((data: Array<Company> ) => {
                    return data
                })
            })
        }
        const companies = await getProjectById()
        if (companies != null) {
            return { props : { companies } }
        } else {
            return { props : { companies: null } }
        }
    } catch (error) {
        console.log(error)
        return { props : { companies: null } }
    }
}

export default ({ companies }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const context = useContext(AuthContext)
    return (
        <>
            <Head>
                <title>Broker Best</title>
                <meta name="description" content="Broker Best teste" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <TopNavbar contextUser={context}></TopNavbar>
            <TitleBar title={'Meus Empreendimentos'}></TitleBar>

        </>
    )
}