import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import S3 from "aws-sdk/clients/s3"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (!session) {
            res.status(401).json('Unauthorized')
            return
        }

        const s3 = new S3({
            signatureVersion: 'v4',
            region: 'us-east-1',
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        })

        const preSignedUrl = await s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: req.query.key,
            Expires: 5 * 60
        })
        res.status(200).json({
            "url": preSignedUrl
        })
    } catch (error) {
        console.log(error)
        res.status(500).json('Server Error')
    }
}