import type { NextApiRequest, NextApiResponse } from 'next'
import authenticateRequest from '../authentication';
import { emailValidateModel, sessionModel } from '../models/userModels';
import { getServerSession } from 'next-auth';
import { authOptions } from './[...nextauth]'
import { sendAuthMail } from '../services/userServices';

type Token = {
  token: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  authenticateRequest(req, res, async () => {
    const session = await getServerSession(req, res, authOptions)
    const response = sessionModel.safeParse({
        ...session.user
    })
    if (!response.success) {
      const { errors } = response.error;
      console.log('errors '+ errors)

      return res.status(400).json({
        error: { message: "Invalid request", errors },
      });
    }
    const newEmail = await sendAuthMail(response.data)
    res.status(200).json('ok')
  })
}
