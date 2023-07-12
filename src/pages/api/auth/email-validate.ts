import type { NextApiRequest, NextApiResponse } from 'next'
import authenticateRequest from '../authentication';
import { emailValidateModel } from '../models/userModels';
import { getServerSession } from 'next-auth';
import { authOptions } from './[...nextauth]'

type Token = {
  token: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const { method } = req
  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({
      error: { message: `Method ${method} Not Allowed` },
    });
  }

  authenticateRequest(req, res, async () => {
    const session = await getServerSession(req, res, authOptions)
    const response = emailValidateModel.safeParse({
      token: JSON.parse(req.body).token,
      session: session.user
    })
    if (!response.success) {
      const { errors } = response.error;
      console.log('errors '+ errors)

      return res.status(400).json({
        error: { message: "Invalid request", errors },
      });
    }
    const sendToken = fetch(`${process.env.API_URL}/auth/email-validate`, {
      method: 'POST',
      body: JSON.stringify(response.data),
      headers: {
        'Content-Type': 'application/json',
        'authenticator': process.env.AUTH_KEY as string
      }
    })
    .then(response => response.json())
    .then(data => {
      return JSON.parse(data)
    })
    const result = await sendToken
    if (result) {
      res.status(200).json('ok')
    } else {
      res.status(401).json('ok')
    }
  })
}
