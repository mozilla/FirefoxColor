#!/bin/bash

if [ "${CIRCLE_BRANCH}" == "development" ]
then
  SITE_URL="https://mozilla.github.io/FirefoxColor/"
  ADDON_URL="testing.html"
elif [ "${CIRCLE_BRANCH}" == "stage" ]
then
  SITE_URL="https://color.stage.mozaws.net/"
  ADDON_URL="testing.html"
elif [ "${CIRCLE_BRANCH}" == "production" ]
then
  SITE_URL="https://color.firefox.com/"
  ADDON_URL="https://addons.mozilla.org/firefox/addon/firefox-color/"
else
  echo "Unknown branch: ${CIRCLE_BRANCH}" >&2
  exit 1
fi
