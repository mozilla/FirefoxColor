import React from "react";
import classNames from "classnames";
import Browser from "../Browser";
import StorageSpaceInformation from "../StorageSpaceInformation";
import { getCustomImages } from "../../../../lib/utils";

import "./index.scss";

import iconClose from "./close.svg";

export const PaginatedThemeSelector = ({
  themes,
  className,
  previewClassName,
  onClick,
  onDelete = null,
  perPage = 9,
  currentPage = 1,
  setCurrentPage,
  images = []
}) => {
  const itemCount = themes.length;

  React.useEffect(() => {
    const pageCount = Math.ceil(itemCount / perPage);
    if (itemCount && currentPage >= pageCount) {
      setCurrentPage(pageCount - 1);
    }
  }, [itemCount]);

  const pageCount = Math.ceil(itemCount / perPage);
  const startIdx = perPage * currentPage;
  const endIdx = startIdx + perPage;
  const page = themes.slice(startIdx, endIdx);

  const prevDisabled = currentPage <= 0;
  const nextDisabled = currentPage + 1 >= pageCount;

  const pageContent = page.map(([key, { theme }]) => {
    const customImages = getCustomImages(
      theme.images.custom_backgrounds,
      images
    );
    const cleanTheme = {
      ...theme,
      images: {
        ...theme.images,
        custom_backgrounds: customImages
      }
    };

    return (
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
        <Browser
          {...{
            size: "small",
            theme: cleanTheme,
            customImages,
            onClick: () => onClick(cleanTheme)
          }}
        />
      </div>
    );
  });

  const footerPager = pageCount > 1 && (
    <div className="page-selector" role="navigation" aria-label="pagination">
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
          title={`Page ${idx + 1} of ${pageCount}`}
          aria-current={
            currentPage ? "page" : "false"
          }
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
    </div>
  );

  return (
    <>
      <div className={classNames("theme-selector", className)}>
        {pageContent}
      </div>

      <footer
        className={classNames("theme-selector-footer", {
          "theme-selector-footer-expanded": pageCount > 1
        })}
      >
        {footerPager}
        <StorageSpaceInformation />
      </footer>
    </>
  );
};

export default PaginatedThemeSelector;
