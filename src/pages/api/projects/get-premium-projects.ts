import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (!session) {
            res.status(401).json('Unauthorized')
            return
        }
        const getPremiumProjects = async () => {
            let url = `${process.env.API_URL}/project-services/get-premium-projects`
            return await fetch(url, {
                headers: {
                    'authenticator': process.env.AUTH_KEY as string
                }
            })
            .then(response => {
                if (!response.ok) {
                    return null
                } 
                else return response.json().then(data => {
                    return data
                })
            })
        }
        const projects = await getPremiumProjects()
        if (projects != null) {
            res.status(200).json(projects)
        } else {
            res.status(401).json('Unauthorized')
        }
    } catch (error) {
        console.log(error)
        res.status(500).json('Server Error')
    }
}