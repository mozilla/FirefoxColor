if [ "${CIRCLE_BRANCH}" == "development" ]
then
  export SITE_URL="https://mozilla.github.io/FirefoxColor/"
  export ADDON_URL="testing.html"
elif [ "${CIRCLE_BRANCH}" == "stage" ]
then
  export SITE_URL="https://color.stage.mozaws.net/"
  export ADDON_URL="testing.html"
elif [ "${CIRCLE_BRANCH}" == "production" ]
  export SITE_URL="https://color.firefox.com/"
  export ADDON_URL="https://addons.mozilla.org/firefox/addon/firefox-color/"
fi

exit 0
