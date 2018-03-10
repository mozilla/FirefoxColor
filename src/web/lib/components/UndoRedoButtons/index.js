import React from "react";
import classnames from "classnames";

import "./index.scss";

import iconRedo from "./icon_redo.svg";
import iconUndo from "./icon_undo.svg";

export const UndoRedoButtons = ({
  undo,
  redo,
  themeCanUndo,
  themeCanRedo
}) => (
  <div className="undoRedo">
    <button title="Undo" className={classnames("undo", { disabled: !themeCanUndo })} onClick={undo}>
      <img src={iconUndo} />
    </button>
    <button title="Redo" className={classnames("redo", { disabled: !themeCanRedo })} onClick={redo}>
      <img src={iconRedo} />
    </button>
  </div>
);

export default UndoRedoButtons;
