import { ReactNode } from "react"

export default function Container(props: {children: ReactNode}) {
    return (
        <div className="Container">
            {props.children}
        </div>
    )
}