import { BasicProject, Company as CompanyType } from "./helpers/interfaces"

export class newUser {
    nome: string
    email: string
    tel: string
    cep: string
    endereco: string
    num: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    password: string

    constructor(nome: string, email: string, tel: string, cep: string, endereco: string,
        num: string, complemento: string, bairro: string, cidade: string, uf: string, password: string) {
        this.nome = nome;
        this.email = email;
        this.tel = tel;
        this.cep = cep;
        this.endereco = endereco;
        this.num = num;
        this.complemento = complemento;
        this.bairro = bairro;
        this.cidade = cidade;
        this.uf = uf;
        this.password = password;
    }
}

export class CompleteData {
    nome: string
    email: string
    tel: string
    imobiliaria: string
    cep: string
    endereco: string
    num: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    provider: number


    constructor(nome: string, email: string, tel: string, imobiliaria: string, cep: string, endereco: string,
        num: string, complemento: string, bairro: string, cidade: string, uf: string, provider: number) {
        this.nome = nome;
        this.email = email;
        this.tel = tel;
        this.imobiliaria = imobiliaria;
        this.cep = cep;
        this.endereco = endereco;
        this.num = num;
        this.complemento = complemento;
        this.bairro = bairro;
        this.cidade = cidade;
        this.uf = uf;
        this.provider = provider;
    }
}

export class ProjectQueryParamsClass {
    key: string
    offset: number
    order_by: 'id' | 'name' | 'deliveryDate'
    guidance: 'asc' | 'desc'


    constructor(
        key: string = '',
        offset: number = 0,
        order_by: 'id' | 'name' | 'deliveryDate' = 'id',
        guidance: 'asc' | 'desc' = 'asc') {
        this.key = key
        this.offset = offset;
        this.order_by = order_by;
        this.guidance = guidance;
    }
}

export class ProjectDataClass {
    data: Array<BasicProject>
    partialCount: number
    totalCount: number

    constructor(data: Array<BasicProject> = [], partialCount: number = 0, totalCount: number = 0) {
        this.data = data
        this.partialCount = partialCount
        this.totalCount = totalCount
    }
}

export class PremiumDataClass {
    companyes: Array<CompanyType> | null
    lastUpdate: Date | null
    premiumUpdate?: Function

    constructor(companyes: Array<CompanyType> | null = [], lastUpdate: Date | null = null, premiumUpdate?: Function) {
        this.companyes = companyes
        this.lastUpdate = lastUpdate
        this.premiumUpdate = premiumUpdate
    }
}

export class Company {
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

    constructor(
        id: number | null,
        name: string | null,
        description: string | null,
        email: string | null,
        tel: string | null,
        address: string | null,
        num: string | null,
        complement: string | null,
        district: string | null,
        city: string | null,
        uf: string | null,
        cep: string | null,
        thumb: string | null,
        images: string | null,
        admin_id: number | null,
        is_active: boolean | null
    ) {
        this.id = id
        this.name = name
        this.description = description
        this.email = email
        this.tel = tel
        this.address = address
        this.num = num
        this.complement = complement
        this.district = district
        this.city = city
        this.uf = uf
        this.cep = cep
        this.thumb = thumb
        this.images = images
        this.admin_id = admin_id
        this.is_active = is_active
    }
}

export class Project {
    id: number | null
    admin_id: number | null
    company_id: number | null
    name: string | null
    description?: string | null
    delivery_date?: Date | string | null
    address?: string | null
    num?: string | null
    complement?: string | null
    district?: string | null
    zone?: string | null
    city?: string | null
    uf?: string | null
    cep?: string | null
    latitude?: number | null
    longitude?: number | null
    status?: string | null
    thumb?: string | null
    images?: Array<string> | null
    videos?: Array<string> | null
    link?: string | null
    book?: string | null

    constructor(
        id: number | null,
        admin_id: number | null,
        company_id: number | null,
        name: string | null,
        description?: string | null,
        delivery_date?: Date | string | null,
        address?: string | null,
        num?: string | null,
        complement?: string | null,
        district?: string | null,
        zone?: string | null,
        city?: string | null,
        uf?: string | null,
        cep?: string | null,
        latitude?: number | null,
        longitude?: number | null,
        status?: string | null,
        thumb?: string | null,
        images?: Array<string> | null,
        videos?: Array<string> | null,
        link?: string | null,
        book?: string | null
    ) {
        this.id = id
        this.admin_id = admin_id
        this.company_id = company_id
        this.name = name
        this.description = description
        this.delivery_date = delivery_date
        this.address = address
        this.num = num
        this.complement = complement
        this.district = district
        this.zone = zone
        this.city = city
        this.uf = uf
        this.cep = cep
        this.latitude = latitude
        this.longitude = longitude
        this.status = status
        this.thumb = thumb
        this.images = images
        this.videos = videos
        this.link = link
        this.book = book
    }
}

export class Property {
    id: number | null
    company_id: number | null
    project_id: number | null
    name: string | null
    description: string | null
    delivery_date: Date | string | null
    model: string | null
    measure: string | null
    size: number | null
    price: number | null
    status: string | null
    thumb: string | null
    images: Array<string>
    videos: Array<string>

    constructor(
        id: number | null,
        company_id: number | null,
        project_id: number | null,
        name: string | null,
        description: string | null,
        delivery_date: Date | string | null,
        model: string | null,
        measure: string | null,
        size: number | null,
        price: number | null,
        status: string | null,
        thumb: string | null,
        images: Array<string>,
        videos: Array<string>
    ) {
        this.id = id
        this.company_id = company_id
        this.project_id = project_id
        this.name = name
        this.description = description
        this.delivery_date = delivery_date
        this.model = model
        this.measure = measure
        this.size = size
        this.price = price
        this.status = status
        this.thumb = thumb
        this.images = images
        this.videos = videos
    }
}
