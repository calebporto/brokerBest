import { getCsrfToken, signOut } from 'next-auth/react'
import Router from 'next/router'
import { Dispatch, SetStateAction, useContext } from 'react'
import { GeneralContext, WindowDimensions } from './interfaces'
import imageCompression from 'browser-image-compression'

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
        signOut({ callbackUrl: '/entrar' })
    } else {
        await signOut({ redirect: false })
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
        let newWord = word.length > 0 ? word[0].toUpperCase() + word.substring(1) : word
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
    uf: string | null | undefined): string {

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

export function windowOpen(window: Window | null, link: string | null | undefined) {
    if (window && link) {
        window.open(link)
    }
}

const defaultOptions = {
    maxSizeMB: 1
};
export async function compressFile(imageFile: File, options = defaultOptions) {
    return await imageCompression(imageFile, options);
}

export async function uploadToIbb(imageFile: File | null, imgName: string) {
    try {
        if (!imageFile) return null

        const ibbKey = process.env.NEXT_PUBLIC_IBB_KEY as string
        const formData = new FormData()
        formData.append('image', imageFile)
        formData.append('key', ibbKey)
        formData.append('name', imgName)
        
    
        const ibbUpload = await fetch(`https://api.imgbb.com/1/upload?key=${ibbKey}`, {
            method: 'POST',
            body: formData
        }).then(response => {
            if (!response.ok) {
                return null
            }
            else return response.json().then(data => {
                return data
            })
        })
        return await ibbUpload

    } catch (error) {
        console.log(error)
        return null
    }
}

export async function compressAndUploadToIbb(imageFile: File | null, imgName: string) {
    try {
        if (!imageFile) return null
        var compressedImg = await compressFile(imageFile)
    
        const ibbKey = process.env.NEXT_PUBLIC_IBB_KEY as string
        const formData = new FormData()
        formData.append('image', compressedImg)
        formData.append('key', ibbKey)
        formData.append('name', imgName)
        
    
        const ibbUpload = await fetch(`https://api.imgbb.com/1/upload?key=${ibbKey}`, {
            method: 'POST',
            body: formData
        }).then(response => {
            if (!response.ok) {
                return null
            }
            else return response.json().then(data => {
                return data
            })
        })
        return await ibbUpload

    } catch (error) {
        console.log(error)
        return null
    }
}

export function parseYoutubeLink(link: string) {
    let inverted = ''
    for (let i = link.length - 1; i >= 0; i--) {
        if (link[i] == '=' || link[i] == '/') break
        inverted = inverted + link[i]
    }
    let normal = inverted.split("").reverse().join("")

    return 'https://www.youtube.com/embed/' + normal
}
