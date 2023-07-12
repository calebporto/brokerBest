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

export function allFirstUppercase(string: string | null | undefined) {
    if (!string) return
    let words = string.split(' ')
    let newWords = [] as Array<string>
    words.forEach(word => {
        if (word == 'de' || word == 'dos' || word == 'das' || word == 'do' || word == 'da') {
            newWords.push(word)
            return
        }
        let newWord = word[0].toUpperCase() + word.substring(1)
        newWords.push(newWord)
    })
    return newWords.join(' ').trim()
}

export function firstAndParagraphUppercase(string: string | null | undefined) {
    function isAlphabet(char: string) {
        let alphabet = 'abcdefghijklmnopqrstuvwxyzãáàâéèêíìõóòôú'
        if (alphabet.indexOf(char) != -1 && alphabet.toUpperCase().indexOf(char) != -1) {
            return true
        }
        return false
    }

    if (!string) return
    let newString = ''
    let isAfterPoint = false
    for (let i = 0; i < string.length; i++) {
        if (i == 0) {
            newString = newString + string[i].toUpperCase()
            continue
        }
        if (string[i] == '.' || string[i] == '!' || string[i] == '?') {
            isAfterPoint = true
            newString = newString + string[i]
            continue
            // if (i + 1 < string.length) {
            //     if (isAlphabet(string[i + 1])) {
            //         newString = newString + string[i + 1].toUpperCase()
            //         continue
            //     } else {
                //         newString = newString + string[i + 1]
                //         continue
                //     }
                // }
        }
        if (string[i] == ' ') {
            newString = newString + string[i]
            continue
        }
        if (isAfterPoint) {
            if (isAlphabet(string[i])) {
                newString = newString + string[i].toUpperCase()
                isAfterPoint = false
                continue
            } else {
                newString = newString + string[i]
                continue
            }
        } else {
            newString = newString + string[i]
            continue
        }
    }
    return newString
}
export function parseAddress(
    address: string | null | undefined, 
    num: string | null | undefined, 
    complement: string | null | undefined,
    district: string | null | undefined,
    city: string | null | undefined,
    uf: string | null | undefined): string{

    if (!address && !district && !city) return ''
    var completeAddress = ''
    if (address) {
        completeAddress = address
        if (num) {
            completeAddress = `${completeAddress} ${num}`
        }
        if (complement) {
            completeAddress = `${completeAddress}, ${complement}`
        }
    }
    if (district) {
        if (completeAddress == '') {
            completeAddress = district
        } else {
            completeAddress = `${completeAddress}, ${allFirstUppercase(district)}`
        }
    }
    if (city) {
        completeAddress = `${completeAddress}. ${allFirstUppercase(city)}`
        if (uf) {
            completeAddress = `${completeAddress} - ${uf.toUpperCase()}`
        }
    }
    return completeAddress
}