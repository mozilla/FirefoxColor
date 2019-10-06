import React from "react";
import { connect } from "react-redux";
import StorageIcon from "./StorageIcon";
import { actions } from "../../../../lib/store";

import "./index.scss";

export const STORAGE_ERROR_MESSAGE = `Sorry! This cannot be added because you are over your storage limit.
  Please delete some images or themes to make space.`;

export const STORAGE_ERROR_MESSAGE_DURATION = 5000;

export const localStorageSpace = () => {
  let size = 0;
  for (let [key, value] of Object.entries(localStorage)) {
    size += key.length + value.length;
  }

  const sizeMB = size / 1000000;
  return parseFloat(sizeMB.toFixed(3));
};

export const StorageSpaceInformationComponent = props => {
  React.useEffect(() => {
    let timer;
    if (props.storageErrorMessage.length > 0) {
      timer = setTimeout(() => props.setStorageErrorMessage(""),
        STORAGE_ERROR_MESSAGE_DURATION
      );
    }

    return function cleanup() {
      clearTimeout(timer);
    };
  }, [props.storageErrorMessage]);

  return (
    <div className="storage-space-information">
      <div className="storage-space-information-content"><StorageIcon /><span>{props.usedStorage}MB out of 5.243MB</span></div>
      {props.usedStorage > 4.5 && !props.storageErrorMessage && (
        <div className="storage-space-information-warning">
          <span>
            You have almost reached your storage limit! <br /> You may need to
            delete some images or themes to make space.
          </span>
        </div>
      )}
      {props.storageErrorMessage && (
        <strong className="storage-space-information-error">
          <div
            className="storage-space-information-warning"
          >{props.storageErrorMessage}</div>
        </strong>
      )}
    </div>
  );
};

export const mapStateToProps = state => {
  const { ui } = state;
  return {
    usedStorage: ui.usedStorage,
    storageErrorMessage: ui.storageErrorMessage
  };
};

const StorageSpaceInformation = connect(mapStateToProps, { setStorageErrorMessage: actions.ui.setStorageErrorMessage })(
  StorageSpaceInformationComponent
);

export default StorageSpaceInformation;
