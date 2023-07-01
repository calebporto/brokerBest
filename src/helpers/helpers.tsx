import { getCsrfToken, signOut } from 'next-auth/react'
import Router from 'next/router'
import { Dispatch, SetStateAction, useContext } from 'react'
import { GeneralContext, WindowDimensions } from './interfaces'

export const authCheck = (session: any) => {
    if (session) {
        if (!session.is_authenticated) {
            Router.push('/entrar/auth-email')
        }
    } else {
        Router.push('/entrar')
    }
}

export async function GetCsrfToken() {
    const token = await getCsrfToken()
    return token
}

export function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export function setWindowDimensions(setPageSize: Dispatch<SetStateAction<WindowDimensions>>) {
    setPageSize(getWindowDimensions())
}

export async function globalSignOut(redirect: boolean = true) {
    console.log(redirect)
    if (redirect) {
        signOut({callbackUrl: '/entrar'})
    } else {
        await signOut({redirect: false})
        Router.push('/entrar')
    }
}

export function checkContextUpdate(context: GeneralContext) {
    const { contextUpdate } = context as any
    // Atualiza o user context de 10 em 10 minutos
    const lastUpdate = context.user.lastUpdate as Date
    const dateNow = new Date()

    if (dateNow.getTime() - lastUpdate.getTime() > 600000) {
        contextUpdate()
    }
}