import Router from 'next/router'

export const authCheck = (session: any) => {
    if (session) {
        if (!session.is_authenticated) {
            Router.push('/entrar/auth-email')
        }
    } else {
        Router.push('/entrar')
    }
}