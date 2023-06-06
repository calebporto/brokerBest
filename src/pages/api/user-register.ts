import type { NextApiRequest, NextApiResponse } from 'next'
import authenticateRequest from './authentication';
import { z } from 'zod'
import { hashPass } from './helpers/bcrypt';
import { user } from './models/userModels';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({
      error: { message: `Method ${method} Not Allowed` },
    });
  }

  authenticateRequest(req, res, async () => {
    const response = user.safeParse(JSON.parse(req.body))
    if (!response.success) {
      const { errors } = response.error;
      console.log('errors '+ errors)
      
      return res.status(400).json({
        error: { message: "Invalid request", errors },
      });
    }
    var data = response.data
    data.password = await hashPass(data.password)
    fetch(`${process.env.API_URL}/user-register/new`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(res => {
      
    })

    res.status(200).json({ message: "Authenticated request" });
  });
}