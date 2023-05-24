import Head from 'next/head'
import Body from '@/layout/Body'
import Container from '@/layout/Container'
import TopNavbar from '@/layout/TopNavbar'
import Initial2 from '@/components/Initial2'
import Initial from '@/components/Initial'
import { useEffect, useState } from 'react'
import Modal from '@/layout/Modal'
import Footer from '@/layout/Footer'
export default function Home() {
  // const [showModal, setShowModal] = useState(false)
  // const [isBrowser, setIsBrowser] = useState(false)
  // useEffect(() => {
  //   setIsBrowser(true)
  //   setShowModal(true)
  // },[])
  return (
    <>
      <Head>
        <title>Broker Best</title>
        <meta name="description" content="Broker Best teste" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Modal id='cookiesModal' show={showModal} onClose={() => setShowModal(false)} title='cookies' body='Testando' isBrowser={isBrowser}/> */}
      <TopNavbar></TopNavbar>
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
