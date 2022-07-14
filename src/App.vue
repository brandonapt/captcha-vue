<template>
  <v-app>
    <form id="captchaelem" method="post">
      <div id="victoryId"></div>
      <input id="FunCaptcha-ID" :value="id" type="hidden" />
      <input type="hidden" id="fc-token" />
      <div id="CAPTCHA"></div>
    </form>
    <button id="enforcement-trigger">trigger element</button>
    <form method="post" target="_self">
      <input type="submit" id="submit-id" onclick="return false;" style="display: none" />
    </form>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      id: "",
      data: {},
    };
  },

  components: {},

  methods: {
    copyTextToClipboard: function (text) {
      if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(
        function () {
          alert("Copied to clipboard");
        },
        function (err) {
          alert("Could not copy text: " + err);
        }
      );
    },
    setupEnforcement: function (myEnforcement) {
      myEnforcement.setConfig({
        selector: "#enforcement-trigger",
        data: {
          blob: this.data,
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
    },
    OnSolve: function () {
      const FCId = document.getElementById("FunCaptcha-ID").value;
      const token = document.getElementById("fc-token").value;
      copyTextToClipboard(btoa(FCId + "," + token));
      alert("solved");
    },
  },
  mounted: async function () {
    console.log("hello");
    let req = await this.$http.get(`/api/publickeys/ACTION_TYPE_WEB_LOGIN`);
    let key = req.data.key;
    let fielddatareq = await this.$http.get("/api/getdata");
    let data = fielddatareq.data.data;
    console.log(fielddatareq.data);
    let id = fielddatareq.data.id;
    this.data = data;
    this.id = id;
    let script = await document.createElement("script");
    await script.setAttribute("src", `/script.js`);
    script.setAttribute("data-id", "scripltoader");
    script.setAttribute("data", data);
    document.head.appendChild(script);

    let arkose = await document.createElement("script");

    await arkose.setAttribute("type", "text/javascript");

    await arkose.setAttribute("data-callback", "loadEnforcement"),
      await arkose.setAttribute(
        "src",
        `https://api.arkoselabs.com/v2/476068BF-9607-4799-B53D-966BE98E2B81/api.js`
      );
    await arkose.setAttribute("async", ""),
      await arkose.setAttribute("defer", ""),
      document.head.appendChild(arkose);
    console.log("running");
  },
};
</script>
