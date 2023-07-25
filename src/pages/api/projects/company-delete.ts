import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (!session || session.user.is_admin == false) {
            res.status(401).json('Unauthorized')
            return
        }
        const sendNewProperty = await fetch(`${process.env.API_URL}/project-services/company-delete?id=${req.query.id}`, {
            headers: {
                'authenticator': process.env.AUTH_KEY as string
            }
        }).then(response => {
            if (!response.ok) return false
            else return true
        })
        const response = sendNewProperty
        if (response) {
            res.status(200).json('Construtora removida com sucesso.')
            return
        } else {
            res.status(400).json('Algo deu errado.')
            return
        }
    } catch (error) {
        res.status(500).json('Erro no servidor.')
        return
    }
}