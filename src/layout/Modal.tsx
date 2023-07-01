import { Dispatch, ReactNode, SetStateAction } from "react";
import style from '../styles/Modal.module.css'
import ReactDOM from "react-dom";

const Modal = (props: {show: boolean, setShow: Dispatch<SetStateAction<boolean>>, title: string, children: ReactNode}) => {
    
  const modalContent = (
      <div className={style.Overlay}>
          <div className={style.Wrapper}>
              <div className={style.Modal}>
                  <div className={style.Header}>
                    <p className={style.Title}></p>
                    <span className={style.Close} onClick={() => props.setShow(false)}>{props.title}</span>
                  </div>
                  <div className={style.Body}>
                    {props.children}
                  </div>
                  <div className={style.Footer}>
                    <button className="btn btn-secondary">Fechar</button>
                  </div>
              </div>
          </div>
      </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root") as HTMLDivElement
);
}
export default Modal