import { ISODateString } from "next-auth"
import { Dispatch, SetStateAction } from "react"

export interface SessionUser {
    name: string,
    email: string,
    image: string | null,
    provider: string | number,
    is_authenticated: boolean | null,
    last_email_exp: ISODateString | null,
    alternative_id: string | null
}

export interface Session {
    expires: ISODateString,
    user: SessionUser
}

export interface WindowDimensions {
    width: number | null,
    height: number | null
}

export interface WindowDimensionsRef {
    current: WindowDimensions
}

export interface User {
    alternative_id: string | null,
    name: string| null,
    email: string| null,
    tel: string| null,
    cep: string| null,
    endereco: string| null,
    num: string| null,
    complemento: string| null,
    bairro: string| null,
    cidade: string| null,
    uf: string| null,
    provider: number| null,
    is_admin: boolean | null,
    is_complete_data: boolean | null,
    lastUpdate: Date | number | null
}

export interface GeneralContext {
    session: any,
    update: any,
    user : User,
    windowDimensions: WindowDimensions,
    systemMessage: string,
    setSystemMessage: Dispatch<SetStateAction<string>>,
    setUser: Dispatch<SetStateAction<User>> | null,
    contextUpdate: Function,
    loginRequire: Function
}