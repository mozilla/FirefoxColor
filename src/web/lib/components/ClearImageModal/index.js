import React from "react";
import Modal from "../Modal";

import "./index.scss";

export default class ClearImageModal extends React.Component {
  render() {
    return (
      <Modal displayModal>
        <p>
          Deleting this image will remove it from any saved themes you have. Do
          you want to proceed?
        </p>
        <div className="modal__buttons">
          <button onClick={this.props.confirm}>Okay</button>
          <button onClick={this.props.cancel}>Cancel</button>
        </div>
      </Modal>
    );
  }
}
