app=new Vue({ 
  el: '#app',
  data: {
    projects: [],
    currentProject: null,
    dialog: null,
    newProjectDialog: null,
    toast: null,
    ws: null,
  },
  methods: {
    pdm() {
        this.$refs.pdm.show=true;
        this.$refs.temperature.show=false;
        this.$refs.rgb.show=false;
        this.$refs.pressure.show=false;
        this.$refs.acc.show=false;
        this.$refs.magnetometer.show=false;
        this.$refs.gyroscope.show=false;
        this.$refs.tinyml.show=false;

    },
    temperature() {
        this.$refs.temperature.show=true;
        this.$refs.pdm.show=false;
        this.$refs.rgb.show=false;
        this.$refs.pressure.show=false;
        this.$refs.acc.show=false;
        this.$refs.magnetometer.show=false;
        this.$refs.gyroscope.show=false;
        this.$refs.tinyml.show=false;

    },
    pressure() {
        this.$refs.temperature.show=false;
        this.$refs.pdm.show=false;
        this.$refs.rgb.show=false;
        this.$refs.pressure.show=true;
        this.$refs.acc.show=false;
        this.$refs.magnetometer.show=false;
        this.$refs.gyroscope.show=false;
        this.$refs.tinyml.show=false;

    },
    rgb() {
        this.$refs.temperature.show=false;
        this.$refs.pdm.show=false;
        this.$refs.rgb.show=true;
        this.$refs.pressure.show=false;
        this.$refs.acc.show=false;
        this.$refs.magnetometer.show=false;
        this.$refs.gyroscope.show=false;
        this.$refs.tinyml.show=false;

    },
    accelerometer() {
        this.$refs.temperature.show=false;
        this.$refs.pdm.show=false;
        this.$refs.rgb.show=false;
        this.$refs.pressure.show=false;
        this.$refs.acc.show=true;
        this.$refs.magnetometer.show=false;
        this.$refs.gyroscope.show=false;
        this.$refs.tinyml.show=false;
    },
    gyroscope() {
        this.$refs.temperature.show=false;
        this.$refs.pdm.show=false;
        this.$refs.rgb.show=false;
        this.$refs.pressure.show=false;
        this.$refs.acc.show=false;
        this.$refs.magnetometer.show=false;
        this.$refs.gyroscope.show=true;
        this.$refs.tinyml.show=false;

    },
    magnetometer() {
        this.$refs.temperature.show=false;
        this.$refs.pdm.show=false;
        this.$refs.rgb.show=false;
        this.$refs.pressure.show=false;
        this.$refs.acc.show=false;
        this.$refs.magnetometer.show=true;
        this.$refs.gyroscope.show=false;
        this.$refs.tinyml.show=false;
    },
    tinyml() {
        this.$refs.temperature.show=false;
        this.$refs.pdm.show=false;
        this.$refs.rgb.show=false;
        this.$refs.pressure.show=false;
        this.$refs.acc.show=false;
        this.$refs.magnetometer.show=false;
        this.$refs.gyroscope.show=false;
        this.$refs.tinyml.show=true;

    }



  },
  created: function () {
    dialog = document.querySelector('#dialog');
    toast = document.querySelector('#toast');
  }
});

dialogAcitions=new Vue({ 
  el: '#dialog_acitions',
  data: {
  },
  methods: {
    cancel: function() {
      console.log('test')
      this.dialog.close();
    }
  },
  created: function () {
    this.dialog = document.querySelector('#dialog');
  }
})
