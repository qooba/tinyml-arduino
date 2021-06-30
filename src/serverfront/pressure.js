
Vue.component('pressure', {
  data: function () {
    return {
      show: false,
      snackbarContainer: document.querySelector('#toast'),
      packages: null,
      ws: null,
      pressure: null,
    }
  },
  props: {
    currentProject: null
  },
  methods: {
    watch(){
        this.ws = new WebSocket("wss://"+window.location.host+"/ws");
        this.ws.onmessage = this.handleEvent;
    },
    prepare(){
        axios.get("/api/arduino/pressure").then(response => {
            console.log(response.data);
	    });
    },
    stop(){
        this.ws.close();
        axios.get("/api/serial/close").then(response => {
            console.log(response.data);
	    });
    },
    handleEvent(event) {
        this.pressure=event.data;
    }
  },
  created(){
  },
  updated(){
  },
  template: `
<main class="mdl-layout__content mdl-color--grey-100" v-if="show">
    <div class="mdl-grid demo-content">
        <div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-grid center-align ">
            <a target="_blank" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" v-on:click="prepare()">PREPARE</a>
            &nbsp&nbsp
            &nbsp&nbsp
            <a target="_blank" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" v-on:click="watch()">WATCH</a>
            &nbsp&nbsp
            &nbsp&nbsp
            <a target="_blank" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" v-on:click="stop()">STOP</a>
        </div>

        <div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-grid">
            <div class="typo-styles__demo mdl-typography--title">
                Pressure:
            </div>
            <div class="typo-styles__demo mdl-typography--display-1">
                &nbsp {{pressure}} kPa
            </div>
        </div>

    </div>
</main>
`
});
