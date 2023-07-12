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

        const getProjectNames = async () => {
            var url = `${process.env.API_URL}/project-services/get-project-names?filter=${type}`
            
            return await fetch(url, {
                headers: {
                    'authenticator': process.env.AUTH_KEY as string
                }
            })
            .then(response => {
                if (!response.ok) return null
                else {
                    return response.json().then(data => data)
                }
            })

        }
        const projectNames = await getProjectNames()
        if (projectNames) {
            res.status(200).json(projectNames)
            return
        } else {
            res.status(400).json('filtro invalido')
        }
    })
}