import { NextApiRequest, NextApiResponse } from "next";
import { getCsrfToken } from "next-auth/react";

export default async function authenticateRequest(req: NextApiRequest, res: NextApiResponse, next: Function) { 
  const { headers, body } = req;
    // Check if the request contains the authentication token
    if (headers.authorization !== process.env.NEXT_PUBLIC_API_TOKEN) {
      console.log('O erro foi aqui')
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    next();
  }