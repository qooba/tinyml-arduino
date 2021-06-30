Vue.component('rgb', {
  data: function () {
    return {
      show: true,
      snackbarContainer: document.querySelector('#toast'),
      packages: null,
      intervalId: null,
      ws: null,
      dataChart: [0],
      dataChartFFT: [0],
      test: [4, 4, 4, 4, 4, 4],
      labels: [0],
      indx: 0,
      total_samples: 10,
      label: 'yes',
      myStyle: {
          //width: "100px",
          height: "200px",
          marginTop: "20px",
          backgroundColor: "rgb(156, 155, 155)"
      }
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
        axios.get("/api/arduino/rgb").then(response => {
            console.log(response.data);
	    });
    },
    stop(){
        this.ws.close();
        this.labels = [0];
        this.dataChart = [0];
        this.dataChartFFT = [0];
        this.indx=0;
        axios.get("/api/serial/close").then(response => {
            console.log(response.data);
	    });

    },
    handleEvent(event) {
        //console.log(event.data);
        e=event.data.split(',');
        this.myStyle.backgroundColor="rgb("+e[1]+","+e[2]+","+e[3]+")"
        //data=JSON.parse(event.data.replaceAll("'",'"'));
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
    <div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid center-align ">
      <div :style="myStyle" class="wrapper" ></div>
    </div>
  </div>
</main>
  `
});
