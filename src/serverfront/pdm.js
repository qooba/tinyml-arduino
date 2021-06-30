//Vue.use(VueChartsJs);
//import { Line } from 'vue-chartjs'
//import VueCharts from 'vue-chartjs'

Vue.component("line-chart-pdm", {
  extends: VueChartJs.Line,
  props: ["data","labels", "options","dataFFT"],
  mounted() {
    this.renderLineChart();
  },
  computed: {
    chartData: function() {
      return this.data;
    },
    chartDataFFT: function() {
      return this.dataFFT;
    },
    labelsData: function() {
      return this.labels;
    }

  },
  methods: {
    renderLineChart: function() {
    this.renderChart(
      {
        labels: this.labelsData,
        datasets: [
          {
            label: "RMS",
            backgroundColor: "#f87979",
            data: this.chartData,
            fill: false,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgb(255, 99, 132)",
            //yAxisID: 'y-axis-1'

          },
          {
            label: "FFT",
            backgroundColor: "#f87979",
            data: this.chartDataFFT,
            fill: false,
            borderColor: "rgb(99, 255, 132)",
            backgroundColor: "rgb(99, 255, 132)",
            //yAxisID: 'y-axis-1'
          }

        ]
      },
      { responsive: true, 
        maintainAspectRatio: false, 
        animation: false, 
        scaleShowLabels : false,
        omitXLabels: true,
        hoverMode: 'index',
        stacked: false,
        showTooltips: false,
        scales: {
            yAxes: [{
                        type: 'linear',
                        display: true,
                        position: 'left',
                        yAxisID: 'y-axis-1',
        }],
        }
      }
    );
    }
  },
  watch: {
    data: function() {
      //this._chart.destroy();
      //this.renderChart(this.data, this.options);
      this.renderLineChart();
    }
  }
});

Vue.component('pdm', {
  data: function () {
    return {
      show: false,
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
      label: 'yes'
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
        axios.get("/api/arduino/pdm").then(response => {
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
        data=JSON.parse(event.data.replaceAll("'",'"'));
        console.log(data);
        for (i=0; i<data.length; ++i){
            this.indx=this.indx+1
            this.labels.push(this.indx);
            this.dataChart.push(parseInt(data[i]['rms']));
            this.dataChartFFT.push(parseInt(data[i]['fft']));
            if (this.labels.length > 100){
                this.labels = this.labels.slice(10);
                this.dataChart = this.dataChart.slice(10);
                this.dataChartFFT = this.dataChartFFT.slice(10);
            }
        }
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


    <div class="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--12-col">
        <line-chart-pdm :data="dataChart" :dataFFT='dataChartFFT' :labels="labels" :options="{responsive: true, maintainAspectRatio: false}"></line-chart-pdm>
    </div>
  </div>
</main>
  `
});
