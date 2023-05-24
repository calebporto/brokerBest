import Head from "next/head"
import Entrar from "@/pageComponents/Entrar"

const EntrarPage = () => {
    return (
        <>
            <Head>
                <title>Broker Best</title>
                <meta name="description" content="Broker Best teste" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Entrar></Entrar>
        </>
    )
}
export default EntrarPage

