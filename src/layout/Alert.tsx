import { AuthContext } from "@/contexts/AuthContext"
import Router from "next/router"
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"

const Alert = (props: {
    message: string,
    setMessage?: Dispatch<SetStateAction<string>>,
    type: string, 
    show: boolean, 
    handleShow: Function, 
    clickAction?: string | null,
    showSystemMessage?: boolean}) => {
    const { systemMessage, setSystemMessage } = useContext(AuthContext)
    const action = () => {
        if (props.clickAction) {
            Router.push(props.clickAction)
        }
    }
    const actionStyle = props.clickAction ? {cursor: 'pointer'} : {}

    if (props.showSystemMessage) {
        if (systemMessage && systemMessage != '') {
            if (props.setMessage) {
                props.setMessage(systemMessage.slice(0))
            }
            props.handleShow(true)
            setSystemMessage('')
        }
    }
    return (
        props.show
        ? <div className={`alert alert-${props.type} alert-dismissible fade show`} style={actionStyle} tabIndex={0}>
            <span onClick={() => action()}>{ props.message }</span>
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