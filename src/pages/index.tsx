import Head from 'next/head'
import Body from '@/layout/Body'
import Container from '@/layout/Container'
import TopNavbar from '@/layout/TopNavbar'
import Initial2 from '@/components/Initial2'
import Initial from '@/components/Initial'
import Footer from '@/layout/Footer'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'

export default function Home() {
  const context = useContext(AuthContext)
  const { windowDimensions, session } = context
  const [background, setBackground] = useState<string>('url(/media/background-g.jpg)')
  const router = useRouter()

  useEffect(() => {
    if (windowDimensions.width && windowDimensions.width <= 500) {
      setBackground('url(/media/background-p.jpg)')
    } else if (windowDimensions.width && windowDimensions.width <= 915) {
      setBackground('url(/media/background-m.jpg)')
    } else if (windowDimensions.width && windowDimensions.width <= 1300) {
      setBackground('url(/media/background-mm.jpg)')
    } else {
      setBackground('url(/media/background-g.jpg)')
    }
  }, [windowDimensions])
  useEffect(() => {
    if (session === undefined) return
    if (session != null) {
      router.push('/painel')
    }
  }, [session])
  return (
    <>
      <Head>
        <title>Broker Best</title>
        <meta name="description" content="Um guia completo de empreendimentos para você corretor imobiliário." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name='keywords' content='broker best, brokerbest, broker best uberlandia, brokerbest uberlândia, best broker, bestbroker' />
        <meta property="og:title" content="Broker Best" />
        <meta property="og:description" content="Um guia completo de empreendimentos para você corretor imobiliário." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/media/background-mm.jpg" />
        <meta property="og:url" content="https://www.brokerbest.com.br" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopNavbar entrarBt={true} cadastrarBt={true} perfilBt={false} fixed={true} contextUser={context}></TopNavbar>
      <Body id='topo' bgImage={background}>
        <Container>
          <Initial />
        </Container>
      </Body>
      <Body id='topo' bgColor='black'>
        <Container>
          <Initial2 />
        </Container>
      </Body>
      <Footer />
    </>
  )
}
