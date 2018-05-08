import React from "react";
import classNames from "classnames";

import iconClose from "../../../../images/close-16.svg";
import "./index.scss";

export const Modal = ({ toggleModal, displayModal, children }) => {
  const handleToggle = e => {
    e.stopPropagation();
    toggleModal({ display: false });
  };
  return (
    <div className={classNames("modal", {"modal--display": displayModal})} onClick={handleToggle}>
      <div className="modal__content">
        <button className="modal__toggle" title="close" onClick={handleToggle}>
          <img src={iconClose} alt="close icon" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
