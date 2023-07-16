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
    id: number | null,
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

export interface Project {
    id: number,
    admin_id: number,
    company_id: number,
    name: string,
    description?: string,
    delivery_date?: Date,
    address?: string,
    num?: string,
    complement?: string,
    district?: string,
    zone?: string,
    city?: string,
    uf?: string,
    cep?: string,
    latitude?: number,
    longitude?: number,
    status?: string,
    thumb?: string,
    images?: Array<string>,
    videos?: Array<string>,
    link?: string,
    book?: string
}

export interface ProjectQueryParams {
    key: string,
    offset: number,
    order_by: 'id' | 'name' | 'deliveryDate',
    guidance: 'asc' | 'desc'
}

export interface ProjectResponse {
    data: Array<BasicProject>
    count: number
}

export interface BasicProject {
    id: number
    name: string
    thumb: string
    delivery_date: string | Date
    admin_id: number
}

export interface ProjectData {
    data: Array<BasicProject>
    partialCount: number
    totalCount: number
}

export interface PremiumData {
    projects: Array<Project> | null
    lastUpdate: Date | null
    premiumUpdate?: Function
}

export interface Property {
    id: number | null
    company_id: number | null
    project_id: number | null
    name: string | null
    description: string | null
    delivery_date: Date | string | null
    model: string | null
    measure: string | null
    size: string | null
    price: number | null
    status: string | null
    thumb: string | null
    images: Array<string>
    videos: Array<string>
}

export interface Company {
    id: number | null
    name: string | null
    description: string | null
    email: string | null
    tel: string | null
    address: string | null
    num: string | null
    complement: string | null
    district: string | null
    city: string | null
    uf: string | null
    cep: string | null
    thumb: string | null
    images: string | null
    admin_id: number | null
    is_active: boolean | null
}

export interface ProjectView {
    project: Project | null
    company: Company | null
    properties: Array<Property>
}