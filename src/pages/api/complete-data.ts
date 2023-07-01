import { NextApiRequest, NextApiResponse } from "next";
import authenticateRequest from "./authentication";
import { user } from "./models/userModels";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

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
      if (!session) {
          res.status(401).json('Unauthorized')
          return
      }
      const reqBody = JSON.parse(req.body)
      const response = user.safeParse(reqBody.data)
      if (!response.success) {
        const { errors } = response.error;
        console.log('errors')
        console.log(errors)
        
        return res.status(400).json({
          error: { message: "Invalid request", errors },
        });
      }
      var data = response.data
      
      const sendData = fetch(`${process.env.API_URL}/user-register/complete`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
      })
      .then(response => response.status)
      
      res.status(await sendData).json('');
      return
    });
  }