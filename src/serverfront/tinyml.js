Vue.component("dropzone",{
  template: `<div class='dropzone'></div>`,
  props: {
    currentProject: null,
  },
  data() {
    return {
      uploadDropzone: null,
      modelName: Date.now().toString()
    };
  },
  methods: {
      reload(){
      }
  },
  mounted(){
    this.uploadDropzone= new Dropzone(this.$el, {
        url:"/api/scissors/"+this.modelName, 
        paramName: "file",
        method: "post",
        timeout: 36000000,
        responseType: 'arraybuffer',
        success: function(file, response){
            console.log(file)
            var imageBlob = response;
            var imageBytes = btoa(
              new Uint8Array(response)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

                var outputImg = document.getElementById('output');
                outputImg.src = 'data:image/png;base64,'+imageBytes;

                var inputImg = document.getElementById('input');
                inputImg.src = file.dataURL;

                //var blob = new Blob(new Uint8Array(response), {type: "image/png"});
                //saveAs(blob, 'out.png');


        }
    });
  }
})

Vue.component('tinyml', {
  data: function () {
    return {
      show: false,
      snackbarContainer: document.querySelector('#toast'),
      packages: null,
      intervalId: null,
      ws: null,
      className: "class1",
      capturedData: "Red,Green,Blue\n",
      numberOfSamples: 1000,
      sampleIdx: 0,
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
        axios.get("/api/arduino/objectcolorcapture").then(response => {
            console.log(response.data);
	    });
    },
    stop(){
        this.ws.close();
        axios.get("/api/serial/close").then(response => {
            console.log(response.data);
	    });

    },
    download() {
        var blob = new Blob([this.capturedData], {type: "text/csv;charset=utf-8"});
        saveAs(blob, this.className+".csv");
    },
    reset(){
      this.capturedData= "Red,Green,Blue\n";
    },
    handleEvent(event) {
        //console.log(event.data);
        if(this.sampleIdx<this.numberOfSamples){
            e=event.data.split(',');
            this.myStyle.backgroundColor=`rgb(${e[4]},${e[5]},${e[6]})`
            this.capturedData+=`${e[0]},${e[1]},${e[2]}\n`;
            this.sampleIdx+=1;
        }

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
    <div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid center-align ">
        <div class="typo-styles__demo mdl-typography--title">TINY ML OBJECT COLOR DETECTION</div><br/>
    </div>

    <div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid center-align ">
        <div class="typo-styles__demo mdl-typography--title">STEP 1 DATA :</div><br/>
        &nbsp&nbsp
        <a target="_blank" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" v-on:click="prepare()">PREPARE</a>
        &nbsp&nbsp
        &nbsp&nbsp
        <a target="_blank" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" v-on:click="watch()">WATCH</a>
        &nbsp&nbsp
        &nbsp&nbsp
        <a target="_blank" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" v-on:click="stop()">STOP</a>
        &nbsp&nbsp
        Class name:
        &nbsp&nbsp
        <input class="mdl-textfield__input mdl-cell--1-col" type="text" v-model="className">
        &nbsp&nbsp
        Number of samples:
        &nbsp&nbsp
        <input class="mdl-textfield__input mdl-cell--1-col" type="text" v-model="numberOfSamples">
        &nbsp&nbsp
        <div>{{sampleIdx}}/{{numberOfSamples}}</div>
    </div>
    <div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-grid center-align ">
      <div :style="myStyle" class="wrapper" ></div>
    </div>
    <div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-grid center-align ">
      <textarea name="Text1" cols="100" rows="15" v-model="capturedData"></textarea>
      <a target="_blank" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" v-on:click="download()">DOWNLOAD</a>
      &nbsp&nbsp
      &nbsp&nbsp
      <a target="_blank" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" v-on:click="reset()">RESET</a>
    </div>
    <div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid center-align ">
        <div class="typo-styles__demo mdl-typography--title">STEP 2 UPLOAD TENSORFLOW LITE MODEL (model.h) :</div><br/>
    </div>
    <div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-grid center-align ">
      <dropzone :current-project="currentProject" ref="dropzone"></dropzone>
    </div>

  </div>
</main>
  `
});
