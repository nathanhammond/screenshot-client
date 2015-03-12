(function(window, document, querystring) {
  // TODO: Make fault tolerant.
  var screenshotServerURL = /screenshotServerURL=([^&]*)/.match(querystring);
  var screenshotClientID = /screenshotClientID=([^&]*)/.match(querystring);

  // Don't redefine an existing function.
  if (window.takeScreenshot) { return; }

  window.takeScreenshot = function(asynchronous) {
    // TODO: Collect metadata.
    // TODO: Ensure that this escapes correctly.
    var metadata = encodeURIComponent(JSON.stringify({
      scrollHeight: document.body.scrollHeight,
      outerHeight: window.outerHeight,
      innerHeight: window.innerHeight
    }));

    var endpoint = screenshotServerURL + '?screenshotClientID=' + screenshotClientID + '&metadata=' + metadata;
    var xhr = new XMLHttpRequest();

    if (!asynchronous) {
      xhr.open("POST", endpoint, false);
      xhr.send();
      // TODO: Fail gracefully.
      return true;
    } else {
      return new Promise(function(resolve, reject) {
        xhr.open("POST", endpoint, true);
        xhr.addEventListener("load", resolve, false);
        xhr.addEventListener("error", reject, false);
        xhr.addEventListener("abort", reject, false);
        xhr.send();
      });
    }
  }
})(window, document, window.location.search);
