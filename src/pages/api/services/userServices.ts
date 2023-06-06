import { Router } from "next/router"
import { sessionModel } from "../models/userModels"

export const sendAuthMail = async (userData: Object) => {
    const sendData = fetch(`${process.env.API_URL}/auth/send_auth_mail`, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(resp => {
        return resp
    })
    return await sendData
}
