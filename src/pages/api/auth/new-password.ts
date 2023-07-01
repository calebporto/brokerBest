import { NextApiRequest, NextApiResponse } from "next";
import authenticateRequest from "../authentication";
import { getCsrfToken } from "next-auth/react";

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    authenticateRequest(req, res, async () => {
      // Tem que pegar o email enviado para verificar no servidor
      const sendEmail = fetch(`${process.env.API_URL}/auth/send-new-password`, {
        method: 'POST',
        body: req.body,
        headers: {'Content-Type': 'application/json'}
      })
      .then(response => {
        return response.status
      })
      const result = await sendEmail
      res.status(result).json('')
    })
  }