import Router from "next/router"

const Alert = (props: {message: string, type: string, show: boolean, handleShow: Function, clickAction?: string | null}) => {
    const action = () => {
        if (props.clickAction) {
            Router.push(props.clickAction)
        }
    }
    const actionStyle = props.clickAction ? {cursor: 'pointer'} : {}
    return (
        props.show
        ? <div className={`alert alert-${props.type} alert-dismissible fade show`} style={actionStyle} tabIndex={0} onClick={() => action()}>
            { props.message }
            <button onClick={() => props.handleShow(false) } autoFocus type="button" className="btn-close" data-bs-dismiss="alert"  aria-label="Close"></button>
        </div>
        : null
    )
}
export function _throwAlert(
    setAlertShow: Function, 
    setAlertMessage: Function, 
    setType: Function, 
    message: string, 
    type: 'warning' | 'danger' | 'success'
    ) {
    setAlertShow(true)
    setAlertMessage(message)
    setType(type)
}
export default Alert