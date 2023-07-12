import { NextApiRequest, NextApiResponse } from "next";
import authenticateRequest from "../authentication";
import { hashPass } from "../helpers/bcrypt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    authenticateRequest(req, res, async() => {
        const reqBody = JSON.parse(req.body)
        const send = {
            type: 'validate',
            token: reqBody.token
        }
        const tokenValidate = fetch(`${process.env.API_URL}/auth/new-password-validate`, {
            method: 'POST',
            body: JSON.stringify(send),
            headers: {
                'Content-Type': 'application/json',
                'authenticator': process.env.AUTH_KEY as string
            }
        })
        .then(response => response.json())
        .then(data => {
            return data
        })
        const result = await tokenValidate
        if (result.status != 200) {
            res.status(result.status).json('')
            return
        }
        const hashedPassword = await hashPass(reqBody.password)
        const sendBody = {
            type: 'recordHash',
            hash: hashedPassword,
            email: result.body.email
        }
        const sendHashedPassword = fetch(`${process.env.API_URL}/auth/new-password-validate`, {
            method: 'POST',
            body: JSON.stringify(sendBody),
            headers: {'Content-Type': 'application/json',
            'authenticator': process.env.AUTH_KEY as string
            }
        })
        .then(response => {
            return response.status
        })
        const status = await sendHashedPassword
        res.status(status).json('')
    })
}