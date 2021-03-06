(function(window, document, querystring) {
  // TODO: Make fault tolerant.
  var screenshotServerURL = decodeURIComponent(/screenshotServerURL=([^&]*)/.exec(querystring)[1]);
  var screenshotClientID = decodeURIComponent(/screenshotClientID=([^&]*)/.exec(querystring)[1]);

  // Don't redefine an existing function.
  if (window.takeScreenshot) { return; }

  window.takeScreenshot = function(asynchronous) {
    // TODO: Collect metadata.
    // TODO: Ensure that this escapes correctly.

    // TODO: Find a better way to get the testId from qunit.
    var testid = (document.getElementsByClassName('running')[0].id).replace('qunit-test-output-','');

    var metadata = encodeURIComponent(JSON.stringify({
      scrollHeight: document.body.scrollHeight,
      outerHeight: window.outerHeight,
      innerHeight: window.innerHeight
    }));

    var endpoint = screenshotServerURL + 'takeScreenshot?screenshotClientID=' + screenshotClientID + '&testid=' + testid + '&metadata=' + metadata;
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
