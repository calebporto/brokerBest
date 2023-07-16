import { AuthContext } from "@/contexts/AuthContext"
import { Project, ProjectView } from "@/helpers/interfaces"
import TopNavbar from "@/layout/TopNavbar"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getServerSession } from "next-auth"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { authOptions } from "../api/auth/[...nextauth]"
import TitleBar from "@/layout/TitleBar"
import { allFirstUppercase, windowOpen } from "@/helpers/helpers"
import Image from "next/image"
import style from '../../styles/Empreendimentos.module.css'
import ProjectData from "@/layout/ProjectData"
import Head from "next/head"
import EmpreendimentosBar from "@/layout/EmpreendimentosBar"

export const getServerSideProps: GetServerSideProps<{project: ProjectView | null}> = async (context) => {
    
    try {
        const session = await getServerSession(context.req, context.res, authOptions)
        if (!session) {
            return { props : {project: null} }
        }
        const getProjectById = async () => {
            let url = `${process.env.API_URL}/project-services/get-project-by-id?id=${context.query.id}
            `
            return await fetch(url, {
                headers: {
                    'authenticator': process.env.AUTH_KEY as string
                }
            })
            .then(response => {
                if (!response.ok) return null
                else return response.json().then((data: ProjectView ) => {
                    return data
                })
            })
        }
        const project = await getProjectById()
        if (project != null) {
            return { props : { project } }
        } else {
            return { props : { project } }
        }
    } catch (error) {
        console.log(error)
        return { props : { project: null } }
    }
}

export default ({ project }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const context = useContext(AuthContext)
    const [showPage, setShowPage] = useState(false)
    const router = useRouter()
    const [windowElement, setWindowElement] = useState<Window | null>(null)

    useEffect(() => {
        if (!windowElement) {
            setWindowElement(window)
        }
    }, [])
    
    useEffect(() => {
        if (!project) {
            context.setSystemMessage('Não foi possível acessar o empreendimento. Tente novamente mais tarde.')
            router.push('/painel')
        }
    }, [project])

    return (
        project ? (
        <>
            <Head>
                <title>Broker Best</title>
                <meta name="description" content="Broker Best teste" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <TopNavbar contextUser={context} ></TopNavbar>
            <EmpreendimentosBar></EmpreendimentosBar>
            <TitleBar title={allFirstUppercase(project.project?.name as string)}></TitleBar>
            <Image onClick={() => windowOpen(windowElement, project.project?.thumb)} className={style.Thumb} alt="" src={project.project?.thumb as string} width={1200} height={724}></Image>
            <ProjectData project={project}></ProjectData>
        </>
        ) : null
    )
}