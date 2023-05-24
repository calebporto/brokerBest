import { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Modal = (props: {id: string, show: boolean, onClose: Function, title: string, body: ReactNode, isBrowser: boolean}) => {
    const handleCloseClick = (e: any) => {
      e.preventDefault();
      props.onClose();
    };

    const modalContent = props.show ? (
      <div className="modalOverlay">
        <div className="modalStyle">
          <div className="modalHeader">
            <div className="modalTitle">{props.title}</div>
            <a href="#" onClick={handleCloseClick}>
              x
            </a>
          </div>
          <div className="modalBody">Tresrtwset</div>
          <div className="modalFooter">
            <button className="cancelarBt">Cancelar</button>
            <button className="confirmarBt">Confirmar</button>
          </div>
        </div>
      </div>
    ) : null


    if (props.isBrowser) {
      const modalDiv = document.getElementById("modal-root")!
      if (modalDiv) {
        return ReactDOM.createPortal(
            modalContent,
            modalDiv
        );
      } else {
        return null
      }
    } else {
      return null;
    }    
}
export default Modal