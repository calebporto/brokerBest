import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import style from '../styles/Modal.module.css'
import ReactDOM from "react-dom";
import { allFirstUppercase } from "@/helpers/helpers";

const Modal = (props: {
  show: boolean, 
  setShow?: Dispatch<SetStateAction<boolean>>, 
  title: string | null | undefined, 
  shortModal?: boolean, 
  children: ReactNode }) => {

  const [divModal, setDivModal] = useState<HTMLDivElement | null>(null)
  const [body, setBody] = useState<HTMLBodyElement | null>(null)
  useEffect(() => {
    setBody(document.body as HTMLBodyElement)
    setDivModal(document.getElementById("modal-root") as HTMLDivElement)
  }, [])

  useEffect(() => {
    if (body) {
      if (props.show) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
    }
  }, [props.show])

  const modalContent = (
    <div className={style.Overlay}>
      <div className={props.shortModal ? style.SmWrapper : style.Wrapper}>
        <div className={style.Modal}>
          <div className={style.Header}>
            <p className={style.Title}>{allFirstUppercase(props.title)}</p>
            {props.setShow ? <span className={style.Close} onClick={(e) => {e.stopPropagation(); props.setShow ? props.setShow(false) : () => null}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
              </svg>
            </span> : null}
          </div>
          <div className={style.Body}>
            {props.children}
          </div>
          <div className={style.Footer}>
            {props.setShow ? <button onClick={(e) => {e.stopPropagation(); props.setShow ? props.setShow(false) : () => null}} className="btn btn-secondary">Fechar</button> : null}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    divModal && props.show ? (
      ReactDOM.createPortal(
        modalContent,
        document.getElementById("modal-root") as HTMLDivElement
      )) : null
  )
}
export default Modal