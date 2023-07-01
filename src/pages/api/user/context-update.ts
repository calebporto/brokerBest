import { NextApiRequest, NextApiResponse } from "next";
import { useSession } from "next-auth/react";
import authenticateRequest from "../authentication";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    authenticateRequest(req, res, async () => {
        const session = await getServerSession(req, res, authOptions)
        if (!session) {
            res.status(401).json('Unauthorized')
            return
        }
        
        const getUser = async () => {
            var url;
            if (session.user.alternative_id) {
                url = `${process.env.API_URL}/user-services/get-context-user?alternative_id=${session.user.alternative_id}`
            } else {
                url = `${process.env.API_URL}/user-services/get-context-user?email=${session.user.email}`
            }
            return await fetch(url)
            .then(response => {
                if (!response.ok) return null
                else {
                    return response.json().then(data => data)
                }
            })

        }
        const user = await getUser()
        if (user) {
            res.status(200).json(user)
            return
        } else {
            if (session.user.provider != 1) {
                res.status(460).json('social')
                return
            } else {
                res.status(401).json('Unauthorized')
                return
            }
        }
    })

}