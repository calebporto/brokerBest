import { createContext, useState } from "react";

export const Message_data = createContext(null)

function Context(children: any) {
    const [message, setMessage] = useState()

    return (
        Message_data
    )
}