import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import StorageIcon from "./StorageIcon";

import "./index.scss";

export const STORAGE_ERROR_MESSAGE = `<span>Sorry! This cannot be added because you are over your storage limit. <br/>
  Please delete some images or themes to make space.</span>`;

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
            dangerouslySetInnerHTML={{
              __html: props.storageErrorMessage
            }}
          />
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

const StorageSpaceInformation = compose(connect(mapStateToProps))(
  StorageSpaceInformationComponent
);

export default StorageSpaceInformation;
