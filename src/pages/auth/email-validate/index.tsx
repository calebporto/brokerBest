import { useRouter } from "next/router"

export default () => {
    const router = useRouter()

    const sendToken = (token: string) => {
        let send = {token: token}

        fetch(`/api/auth/email-validate`, {
            method: 'POST',
            body: JSON.stringify(send),
            headers: {
                'authorization': process.env.NEXT_PUBLIC_API_TOKEN as string
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            return data
        })
    }
    sendToken(router.query.token as string)
    return (
        <p>'kvsdfbgsikf</p>
    )
}