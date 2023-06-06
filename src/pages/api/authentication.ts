import { NextApiRequest, NextApiResponse } from "next";

export default function authenticateRequest(req: NextApiRequest, res: NextApiResponse, next: Function) { 
  const { headers } = req;
    // Check if the request contains the authentication token
    if (headers.authorization !== process.env.NEXT_PUBLIC_API_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    next();
  }