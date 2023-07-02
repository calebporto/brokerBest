import { NextApiRequest, NextApiResponse } from "next";
import authenticateRequest from "../authentication";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    authenticateRequest(req, res, async () => {
        const session = await getServerSession(req, res, authOptions)
        if (!session) {
            res.status(401).json('Unauthorized')
            return
        }
        const type = req.query.type

        var responseList = [] as Array<string>
        if (type == 'bairro') {
            responseList = [
                'guaxindiba',
                'santa clara',
                'gargau',
                'sossego',
                'travessao',
                'maquina',
                'lagoa feia',
                'morro do bode',
                'praça joão pessoa',
                'centro',
                'volta redonda'
            ]
        } else if (type == 'regiao') {
            responseList = [
                'zona sul',
                'zona norte',
                'pedregal',
                'ilha dos mineiros',
                'barra velha'
            ]
        }
        res.status(200).json(responseList)
        return
    })
}