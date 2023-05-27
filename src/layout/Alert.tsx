import { useState } from "react"

const [alertShow, setAlertShow] = useState(false)
const [alertMessage, setAlertMessage] = useState('')
const Alert = (props: {message: string, type: 'success' | 'danger' | 'warning', show: boolean, handleShow: Function}) => {
    return (
        props.show
        ? <div className={`alert alert-${props.type} alert-dismissible fade show`} tabIndex={1}>
            { props.message }
            <button onClick={() => props.handleShow(false) } type="button" className="btn-close" data-bs-dismiss="alert"  aria-label="Close"></button>
        </div>
        : null
    )
}

function throwAlert(message: string) {
    setAlertMessage(message)
    setAlertShow(true)
}
export default Alert