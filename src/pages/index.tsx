import Head from 'next/head'
import Body from '@/layout/Body'
import Container from '@/layout/Container'
import TopNavbar from '@/layout/TopNavbar'
import Initial2 from '@/components/Initial2'
import Initial from '@/components/Initial'
import Footer from '@/layout/Footer'
import { checkContextUpdate } from '@/helpers/helpers'
import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

export default function Home() {
  const { ...context } = useContext(AuthContext)
  if (context.user.lastUpdate) {
      checkContextUpdate(context)
  }
  return (
    <>
      <Head>
        <title>Broker Best</title>
        <meta name="description" content="Broker Best teste" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopNavbar entrarBt={true} cadastrarBt={true} perfilBt={false} fixed={true} contextUser={context}></TopNavbar>
      <Body id='topo' bgImage='url(/media/img3.jpg)'>
        <Container>
          <Initial/>
        </Container>
      </Body>
      <Body id='topo' bgColor='black'>
        <Container>
          <Initial2/>
        </Container>
      </Body>
      <Footer/>
    </>
  )
}
