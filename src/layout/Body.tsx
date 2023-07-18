import { ReactNode } from "react"

interface Props {
    bg?: string, 
    bgColor?: string, 
    bgImage?: string,
    id?: string, 
    children?: ReactNode
}
export default function Body(props: Props) {
    const style = {
        background: props.bg,
        backgroundColor: props.bgColor,
        backgroundImage: props.bgImage
    }
    return (
        <div className="Body" id={props.id} style={style}>
            {props.children}
        </div>
    )
}