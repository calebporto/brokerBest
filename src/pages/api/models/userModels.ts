import { z } from "zod";

export const user = z.object({
    nome: z.string(),
    email: z.string(),
    tel: z.string(),
    cep: z.string(),
    endereco: z.string(),
    num: z.string(),
    complemento: z.string(),
    bairro: z.string(),
    cidade: z.string(),
    uf: z.string(),
    password: z.string(),
    provider: z.number()
  });

export const credentials = z.object({
    email: z.string(),
    password: z.string()
})

export const payloadUserSendMail = z.object({
  alternative_id: z.string(),
  name: z.string(),
  email: z.string()
})

export const sessionModel = z.object({
  alternative_id: z.optional(z.string()),
  name: z.optional(z.string()),
  email: z.optional(z.string()),
  is_authenticated: z.optional(z.boolean())
})

export const emailValidateModel = z.object({
  token: z.string(),
  session: z.object({
    alternative_id: z.string(),
    name: z.string(),
    email: z.string()
  })
})