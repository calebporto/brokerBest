import { ReactNode } from "react"

export default (props: {children: ReactNode}) => {
    return (
        <div className="Container">
            {props.children}
        </div>
    )
}