import React, { useEffect } from "react";
import classNames from "classnames";

import iconClose from "../../../../images/close-16.svg";
import "./index.scss";

export const Modal = ({ toggleModal, displayModal, children }) => {
  const handleToggle = e => {
    e.stopPropagation();
    toggleModal({ display: false });
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleKeyPress = event => {
    if (event.keyCode === 27) {
      toggleModal({ display: false });
    }
  };

  return (
    <div
      className={classNames("modal", { "modal--display": displayModal })}
      onClick={handleToggle}
    >
      <div
        className="modal__content"
        onClick={event => event.stopPropagation()}
      >
        <button className="modal__toggle" title="Close" onClick={handleToggle}>
          <img src={iconClose} alt="close icon" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
