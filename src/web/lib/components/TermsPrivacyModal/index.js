import React from "react";

import Modal from "../Modal";

export const TermsPrivacyModal = ({
  setDisplayLegalModal,
  displayLegalModal
}) => (
  <Modal toggleModal={setDisplayLegalModal} displayModal={displayLegalModal}>
    <h2>Terms &amp; Privacy</h2>
    <p>
      Use of the Firefox Color website is subject to Mozilla’s{" "}
      <a href="https://www.mozilla.org/privacy/websites/">
        Websites Privacy Notice
      </a>{" "}
      and{" "}
      <a href="https://www.mozilla.org/about/legal/terms/mozilla/">
        Websites Terms of Use
      </a>
      .
    </p>
  </Modal>
);

export default TermsPrivacyModal;
