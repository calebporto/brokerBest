import { BasicProject, Project } from "./helpers/interfaces"

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
    cep: string
    endereco: string
    num: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    provider: number


    constructor(nome: string, email: string, tel: string, cep: string, endereco: string,
        num: string, complemento: string, bairro: string, cidade: string, uf: string, provider: number) {
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
        guidance:'asc' | 'desc' = 'asc') {
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
    projects: Array<Project> | null
    lastUpdate: Date | null
    premiumUpdate?: Function

    constructor(projects: Array<Project> | null = [], lastUpdate: Date | null = null, premiumUpdate?: Function) {
        this.projects = projects
        this.lastUpdate = lastUpdate
        this.premiumUpdate = premiumUpdate
    }
}

