import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.css'
import { useEffect } from 'react';
import { SessionProvider } from "next-auth/react"
import { AuthProvider } from '@/contexts/AuthContext';
import Head from 'next/head';
import { PremiumProvider } from '@/contexts/PremiumContext';

export default function App({ Component, pageProps:{ session, ...pageProps} }: AppProps) {
  useEffect( () =>{require("bootstrap/dist/js/bootstrap.bundle.min.js");},[]);
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <PremiumProvider>
          <Component {...pageProps} />
        </PremiumProvider>
      </AuthProvider>
    </SessionProvider>

  )
}
