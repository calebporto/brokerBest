import { useSession } from "next-auth/react"
import Head from "next/head"
import Router from "next/router"

const PainelPage = () => {
    const { data: session} = useSession() as any
    console.log(session)
    return (
        <>
            <Head>
                <title>Broker Best</title>
                <meta name="description" content="Broker Best teste" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <p>Painel</p>
        </>
    )
}
export default PainelPage