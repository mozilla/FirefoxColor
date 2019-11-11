import React from "react";
import Modal from "../Modal";

import "./index.scss";


export default class ClearImageModal extends React.Component {
  confirmRemoveBackground = () => {
    this.props.clearCustomBackground();
    this.onCloseModal();
  }

  cancelRemoveBackground = () => {
    this.onCloseModal();
  }

  onCloseModal = () => {
    this.props.setDisplayRemoveImageModal({ display: false });
    localStorage.setItem("clearImageModal", true);
  }

  render() {
    return (
      <Modal displayModal>
        <p>Deleting this image will remove it from any saved themes you have. Do you want to proceed?</p>
        <div className="modal__buttons">
          <button onClick={this.confirmRemoveBackground}>Okay</button>
          <button onClick={this.cancelRemoveBackground}>Cancel</button>
        </div>
      </Modal>
    );
  }
}
