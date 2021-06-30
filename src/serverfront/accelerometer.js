//Vue.use(VueChartsJs);
//import { Line } from 'vue-chartjs'
//import VueCharts from 'vue-chartjs'

Vue.component("line-chart-acc", {
  extends: VueChartJs.Line,
  props: ["data","labels", "options","dataY","dataZ"],
  mounted() {
    this.renderLineChart();
  },
  computed: {
    chartData: function() {
      return this.data;
    },
    chartDataY: function() {
      return this.dataY;
    },
    chartDataZ: function() {
      return this.dataZ;
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
            label: "X",
            backgroundColor: "#f87979",
            data: this.chartData,
            fill: false,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgb(255, 99, 132)",
            //yAxisID: 'y-axis-1'
          },
          {
            label: "Y",
            backgroundColor: "#f87979",
            data: this.chartDataY,
            fill: false,
            borderColor: "rgb(99, 255, 132)",
            backgroundColor: "rgb(99, 255, 132)",
            //yAxisID: 'y-axis-1'
          },
          {
            label: "Z",
            backgroundColor: "#f87979",
            data: this.chartDataZ,
            fill: false,
            borderColor: "rgb(132, 99, 255)",
            backgroundColor: "rgb(132, 99, 255)",
            //yAxisID: 'y-axis-1'
          },

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

Vue.component('acc', {
  data: function () {
    return {
      show: false,
      snackbarContainer: document.querySelector('#toast'),
      packages: null,
      intervalId: null,
      ws: null,
      dataChart: [0],
      dataChartY: [0],
      dataChartZ: [0],
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
        axios.get("/api/arduino/accelerometer").then(response => {
            console.log(response.data);
	    });
    },
    stop(){
        this.ws.close();
        this.labels = [0];
        this.dataChart = [0];
        this.dataChartY = [0];
        this.dataChartZ = [0];
        this.indx=0;
        axios.get("/api/serial/close").then(response => {
            console.log(response.data);
	    });
    },
    handleEvent(event) {
        data=event.data.split(',');
        console.log(data);
        this.indx=this.indx+1;
        this.labels.push(this.indx);
        this.dataChart.push(parseFloat(data[0]));
        this.dataChartY.push(parseFloat(data[1]));
        this.dataChartZ.push(parseFloat(data[2]));

        if (this.labels.length > 100){
            this.labels = this.labels.slice(10);
            this.dataChart = this.dataChart.slice(10);
            this.dataChartY = this.dataChartY.slice(10);
            this.dataChartZ = this.dataChartZ.slice(10);
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
    <div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-grid center-align ">
        <div class="typo-styles__demo mdl-typography--title">Accelerometer:</div>
        <a target="_blank" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" v-on:click="prepare()">PREPARE</a>
        &nbsp&nbsp
        &nbsp&nbsp
        <a target="_blank" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" v-on:click="watch()">WATCH</a>
        &nbsp&nbsp
        &nbsp&nbsp
        <a target="_blank" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" v-on:click="stop()">STOP</a>
    </div>

    <div class="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--12-col">
        <line-chart-acc :data="dataChart" :dataY="dataChartY" :dataZ="dataChartZ" :labels="labels" :options="{responsive: true, maintainAspectRatio: false}"></line-chart-acc>
    </div>
  </div>
</main>
  `
});
