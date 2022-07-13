<template>
  <v-app>
    <form id="captchaelem" method="post">
      <div id="victoryId"></div>
      <input id="FunCaptcha-ID" :value="id" type="hidden" />
      <input type="hidden" id="fc-token" />
      <div id="CAPTCHA"></div>
    </form>
    <button id="enforcement-trigger">trigger element</button>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      id: "",
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
        onCompleted: function (response) {
          console.log(response.token);
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
    console.log(fielddatareq.data)
    let id = fielddatareq.data.id;
    this.id = id;
    let arkose = await document.createElement("script");
    

    await arkose.setAttribute("type", "text/javascript");
    await arkose.setAttribute("async", ""),
    await arkose.setAttribute("defer", ""),
    await arkose.setAttribute('data-callback', 'this.setupEnforcement'),
      await arkose.setAttribute(
        "src",
        `https://api.arkoselabs.com/v2/${key}/api.js`
      );
   // await document.head.appendChild(arkose);

    await console.log("yes");
    
    setTimeout(async () => {
      await new FunCaptcha({
        public_key: `${key}`,
        target_html: "CAPTCHA",
        data: { blob: data },
        callback: this.OnSolve,
      });
    }, 1000);
    
  },
};
</script>
