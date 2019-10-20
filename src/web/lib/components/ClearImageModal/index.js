import React from "react";
import { withCookies } from "react-cookie";
import Modal from "../Modal";

import "./index.scss";

// TODO: do we need a cancel option?
class ClearImageModal extends React.Component {
  toggalModal = () => {
    this.props.cookies.set("clearImageModal", true, { path: "/" });
    this.props.clearCustomBackground();
  }

  setDisplayModal = () => {
    return !this.props.cookies.get("clearImageModal");
  }

  render() {
    return (
      <Modal toggleModal={this.toggalModal} displayModal={this.setDisplayModal}>
        Deleting this image will remove it from any saved themes you have. Do you want to proceed
      </Modal>
    );
  }
}

export default withCookies(ClearImageModal);
