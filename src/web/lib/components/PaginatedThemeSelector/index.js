import React from "react";
import classNames from "classnames";
import BrowserPreview from "../BrowserPreview";

import "./index.scss";

import iconClose from "./close.svg";

export const PaginatedThemeSelector = ({
  title,
  themes,
  className,
  previewClassName,
  onClick,
  onDelete = null,
  perPage = 12,
  currentPage = 1,
  setCurrentPage
}) => {
  const itemCount = themes.length;
  const pageCount = Math.ceil(itemCount / perPage);
  const startIdx = perPage * currentPage;
  const endIdx = startIdx + perPage;
  const page = themes.slice(startIdx, endIdx);

  const prevDisabled = currentPage <= 0;
  const nextDisabled = currentPage + 1 >= pageCount;

  return (
    <div className={classNames("theme-selector", className)}>
      <h2>{title}</h2>
      {page.map(([key, { theme }]) => (
        <div
          key={key}
          className={classNames("theme-selector-preview", previewClassName)}
        >
          {onDelete && (
            <button
              className="delete-theme"
              onClick={() => onDelete(key)}
              title="Delete"
            >
              <img src={iconClose} />
            </button>
          )}
          <BrowserPreview
            {...{
              size: "small",
              theme,
              onClick: () => onClick(theme)
            }}
          />
        </div>
      ))}
      {pageCount > 1 && (
        <footer className="page-selector">
          <button
            className={classNames("previous", { disabled: prevDisabled })}
            disabled={prevDisabled}
            onClick={
              prevDisabled ? () => {} : () => setCurrentPage(currentPage - 1)
            }
            title="Previous"
          />
          {[...Array(pageCount)].map((_, idx) => (
            <button
              key={idx}
              className={classNames("page", {
                "current-page": idx === currentPage
              })}
              onClick={() => setCurrentPage(idx)}
              title={`Page ${idx + 1}`}
            />
          ))}
          <button
            className={classNames("next", { disabled: nextDisabled })}
            disabled={nextDisabled}
            onClick={
              nextDisabled ? () => {} : () => setCurrentPage(currentPage + 1)
            }
            title="Next"
          />
        </footer>
      )}
    </div>
  );
};

export default PaginatedThemeSelector;
