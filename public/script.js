const attrb = document.querySelector('script[data-id][data-id="scripltoader"]');
console.log(attrb.getAttribute('data'));
function loadEnforcement(myEnforcement) {
    myEnforcement.setConfig({
        selector: "#enforcement-trigger",
        data: {
          blob: attrb.getAttribute('data'),
        },
        onCompleted: function (response) {
          console.log(response.token);
        },
        onReady: function () {
          console.log("onReady");
          document.querySelector("#submit-id").click();
        },
        onReset: function () {
          console.log("onReset");
        },
        onShow: function () {
          console.log("onShow");
        },
        onShown: function () {
          console.log("onShown");
        },
        onError: function (response) {
          console.log("onError");
        },
      });
}