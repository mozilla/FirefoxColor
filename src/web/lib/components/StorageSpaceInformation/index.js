import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import "./index.scss";

export const STORAGE_ERROR_MESSAGE =
  "Sorry! You cannot add this image/theme as it will put you over your storage capacity. Please delete some saved images/themes to make space.";

export const STORAGE_WARNING_MESSAGE =
  "You have almost reached your storage limit! You may need to delete some saved images/themes to make space.";

export const STORAGE_ERROR_MESSAGE_DURATION = 5000;

export const localStorageSpace = () => {
  let data = "";
  for (let key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      data += window.localStorage[key];
    }
  }

  return data
    ? parseFloat(((data.length * 16) / (8 * 1024) / 1000).toFixed(3))
    : 0;
};

export const StorageSpaceInformationComponent = props => {
  return (
    <div className="storage-space-information">
      {props.usedStorage}MB out of 10MB
      {props.usedStorage > 9 && !props.storageErrorMessage && (
        <span className="storage-space-information-warning">
          {STORAGE_WARNING_MESSAGE}
        </span>
      )}
      {props.storageErrorMessage && (
        <strong className="storage-space-information-error">
          {props.storageErrorMessage}
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
