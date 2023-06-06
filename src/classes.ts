class newUser {
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
        num: string, complemento: string, bairro: string, cidade: string, uf: string, password: string ) {
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
