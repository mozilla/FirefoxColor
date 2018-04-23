import React from "react";

import Modal from "../Modal";

export const TermsPrivacyModal = ({
  setDisplayLegalModal,
  displayLegalModal
}) => (
  <Modal toggleModal={setDisplayLegalModal} displayModal={displayLegalModal}>
    <h2>Terms &amp; Privacy</h2>
    <p>
      Firefox Color is currently a Test Pilot experiment, and subject to the
      Test Pilot{" "}
      <a href="https://testpilot.firefox.com/terms">Terms of Service</a> and{" "}
      <a href="https://testpilot.firefox.com/privacy">Privacy Notice</a>. You
      can learn more about this experiment and its data collection{" "}
      <a href="https://testpilot.firefox.com/experiments/color">here</a>.
    </p>
    <p>
      Use of the Firefox Color website is also subject to Mozilla’s{" "}
      <a href="https://www.mozilla.org/privacy/websites/">
        Websites Privacy Notice
      </a>{" "}
      and{" "}
      <a href="https://www.mozilla.org/about/legal/terms/mozilla/">
        Websites Terms of Use
      </a>.
    </p>
  </Modal>
);

export default TermsPrivacyModal;
