import React from "react";
import { withCookies } from "react-cookie";
import Modal from "../Modal";

import "./index.scss";


class ClearImageModal extends React.Component {
  componentDidMount() {
    this.props.cookies.set("clearImageModal", true, { path: "/" });
  }

  toggalModal = ({
    display = false }) => {
    if (display) {
      this.props.clearCustomBackground();
    }

    this.props.setDisplayRemoveImageModal({ display: false });
  }

  render() {
    return (
      <Modal toggleModal={this.toggalModal} displayModal>
        <p>Deleting this image will remove it from any saved themes you have. Do you want to proceed?</p>
        <div className="modal__buttons">
          <button onClick={this.toggalModal.bind(null, { display: true })}>Okay</button>
          <button onClick={this.toggalModal.bind(null, { display: false })}>Cancel</button>
        </div>
      </Modal>
    );
  }
}

export default withCookies(ClearImageModal);
