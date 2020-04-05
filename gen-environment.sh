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
  echo "Unknown branch: ${CIRCLE_BRANCH}"
fi

# This will be appended to $BASH_ENV in .circleci/config.yml
cat <<ENV_HERE
export SITE_URL="${SITE_URL}"
export ADDON_URL="${ADDON_URL}"
ENV_HERE
