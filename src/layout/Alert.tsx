import { useEffect } from "react"

const Alert = (props: {message: string, type: 'success' | 'danger' | 'warning', show: boolean, handleShow: Function}) => {
    useEffect(() => {
        console.log(props.show)
    }, [])
    return (
        props.show
        ? <div className={`alert alert-${props.type} alert-dismissible fade show`}>
            { props.message }
            <button onClick={() => props.handleShow(false) } type="button" className="btn-close" data-bs-dismiss="alert"  aria-label="Close"></button>
        </div>
        : null
    )
}
export default Alert