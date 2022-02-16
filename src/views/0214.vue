<template>
  <div class="main">
    <div class="nav-con">
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="1"
        text-color="#fff"
      >
        <el-menu-item index="1" @click="go_click">
          <el-icon><icon-menu /></el-icon>
          <span>Sensor Data</span>
        </el-menu-item>
       
      </el-menu>
       <el-button @click="clickPause">{{ pauseOrResume[pauseFlag] }}</el-button><br>
        Note: pause to allow zoom
    </div>
    <div class="cont-con">
      <div style="padding: 0 1rem">
        <el-tabs type="border-card" @tab-click="tab_change">
          <el-tab-pane :key="i" v-for="(data, i) in chartsDom">
            <template #label>
              <div :style="data.style">
                <span style="padding: 0 0.5rem">{{ data.title }}</span>
              </div>
            </template>

            <div :id="data.chartId" style="height: 400px; width: 1500px"></div>
          </el-tab-pane>
        </el-tabs>
      </div>



      
      <div class="title-con">
        <el-tag style="font-size: 1.5rem">Robot Agent Action</el-tag>
        <div class="cls-con">
          <div style="padding: 0 1rem">
            <div class="title-style">Agent Schedule</div>

            <div
              style="border: 1px solid #999999; width: 200px; height: 300px"
            ></div>
          </div>
          <div style="flex: 1">
            <div
              id="myChart2"
              :style="{ width: '1400px', height: '400px' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";

let charts: any[] = [];

@Options({
  components: {},
})
export default class Home extends Vue {
  chartsDom: any[] = [];
  times = 0;
  num = 200;
  agent1: string = "";
  agent2 = "Idle";
  agent3 = "Idle";
  agent4 = "Idle";
  agent5 = "Idle";

  index = 0;
  indexNo: number = 0;

  pauseFlag = 0;
  pauseOrResume = ["Pause", "Resume"];

  titles: any[] = [
    "Solar Array Dust Accumulation",
    "ECLSS Dust Damage",
    "ECLSS Paint Damage",
    "Dome Structure Damage",
    "NPG Dust Accumulation",
  ];

  created() {
    for (let c = 0; c < 6; c++) {
      this.chartsDom[c] = {
        chartId: "pane-" + c,
        title: this.titles[c],
      };

      charts[c] = {
        chartId: "pane-" + c,
        chart: {},
        xaxis: [],
        series: [],
        ws: {},
      };
    }
  }

  mounted() {
    for (let i = 0; i < 6; i++) {
      charts[i].chart = this.$echarts.init(
        document.getElementById(charts[i].chartId)
      );
    }
    this.init_ws(0);
    this.init_myChart2()
  }
  clickPause() {
    this.pauseFlag = 1 - this.pauseFlag;
  }
  init_ws(chart_id: number) {
    let obj = charts[chart_id];
    obj.ws = new WebSocket("ws://127.0.0.1:8888/ws/" + (chart_id + 3));

    let arr: any[] = [];

    for (let i = 0; i < 1; i++) {
      obj.xaxis.push("");
      arr.push(0);
    }

    obj.ws.onclose = (evt: any) => {
      console.log("close ws from client side");
    };

    obj.ws.onmessage = (evt: any) => {
      let res = JSON.parse(evt.data);
      res.data.length;

      if (this.indexNo != chart_id) {
        return;
      }

      if (obj.series.length == 0) {
        for (let j = 0; j < res.data.length; j++) {
          obj.series.push({
            name: "hs_" + j,
            type: "line",
            data: JSON.parse(JSON.stringify(arr)),
            silent: true,
            animation: false,
          });
        }
      }

      obj.xaxis.push(res.simulink_time);

      for (var i = 0; i < res.data.length; i++) {
        obj.series[i].data.push(res.data[i]);
      }

      if (res.subparam != 65535 && this.pauseFlag==0) {
        obj.chart.setOption({
          tooltip: {
            trigger: "axis",
          },

          dataZoom: [
            {
              type: "inside",
              start: 50,
              end: 100,
            },
            {
              start: 50,
              end: 100,
              handleIcon:
                "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
              handleSize: "80%",
              handleStyle: {
                color: "#fff",
                shadowBlur: 3,
                shadowColor: "rgba(0, 0, 0, 0.6)",
                shadowOffsetX: 2,
                shadowOffsetY: 2,
              },
            },
          ],

          xAxis: {
            data: obj.xaxis,
            name: "Time",
          },

          yAxis: {
            name: "Sensor Data Value",
          },
          series: obj.series,
        });
      }
    };
  }

  init_myChart2() {
    let chart_id = 5
    let obj = charts[chart_id];
    obj.ws = new WebSocket("ws://127.0.0.1:8888/ws/8");

    let arr: any[] = [];

    for (let i = 0; i < 1; i++) {
      obj.xaxis.push("");
      arr.push(0);
    }

    obj.ws.onclose = (evt: any) => {
      console.log("close ws from client side");
    };

    obj.ws.onmessage = (evt: any) => {
      let res = JSON.parse(evt.data);
      res.data.length;

      if (this.indexNo != chart_id) {
        return;
      }

      if (obj.series.length == 0) {
        for (let j = 0; j < res.data.length; j++) {
          obj.series.push({
            name: "hs_" + j,
            type: "line",
            data: JSON.parse(JSON.stringify(arr)),
            silent: true,
            animation: false,
          });
        }
      }

      obj.xaxis.push(res.simulink_time);

      for (var i = 0; i < res.data.length; i++) {
        obj.series[i].data.push(res.data[i]);
      }

      if (res.subparam != 65535 && this.pauseFlag==0) {
        obj.chart.setOption({
          tooltip: {
            trigger: "axis",
          },

          dataZoom: [
            {
              type: "inside",
              start: 50,
              end: 100,
            },
            {
              start: 50,
              end: 100,
              handleIcon:
                "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
              handleSize: "80%",
              handleStyle: {
                color: "#fff",
                shadowBlur: 3,
                shadowColor: "rgba(0, 0, 0, 0.6)",
                shadowOffsetX: 2,
                shadowOffsetY: 2,
              },
            },
          ],

          xAxis: {
            data: obj.xaxis,
            name: "Time",
          },

          yAxis: {
            name: "Sensor Data Value",
          },
          series: obj.series,
        });
      }
    };
  }
  get_chart2_data() {
    let arr = this.STATES_AGENT.slice(this.times, this.times * 1 + 200);

    let xArr: any[] = [];
    let series: any = [
      {
        name: "act_id",
        type: "line",
        data: [],
      },
    ];
    let Anum = 0;
    arr.map((val: any[]) => {
      xArr.push("");
      series[0].data.push(val[1]);
      Anum = val[1];
    });
    if (Anum < 0) {
      this.agent1 = "Idle";
    } else {
      let arr1 = [
        "",
        "Repair SPG",
        "Repair ECLSS Dust",
        "Repair ECLSS Paint",
        "Repair Structure",
        "Repair NPG",
      ];
      this.agent1 = arr1[Anum];
    }

    return {
      tooltip: {},
      xAxis: {
        data: xArr,
      },

      yAxis: {
        min: -1,
        max: 5,
        axisLabel: {
          formatter: function (value: number) {
            if (value < 0) {
              return "Idel";
            }
            let arr = [
              "",
              "Repair SPG",
              "Repair ECLSS Dust",
              "Repair ECLSS Paint",
              "Repair Structure",
              "Repair NPG",
            ];
            return arr[value];
          },
        },
      },
      series: series,
    };
  }
  resetChart(chart_id: number) {
    charts[chart_id].ws.close();
    charts[chart_id].xaxis = [];
    charts[chart_id].series = [];
  }
  tab_change(tab: any, event: any) {
    this.resetChart(this.indexNo);

    this.index = tab.index;
    this.indexNo = +this.index;
    this.init_ws(this.indexNo);
    // console.log("tab_change",tab.index,event);
  }
  go_click() {
    this.$router.push({
      path: "/page2",
    });
  }
}
</script>




<style scoped>
.title-style {
  font-weight: bold;
  padding-bottom: 0.5rem;
}
.main {
  display: flex;
  justify-content: center;
}

.cont-con {
  flex: 1;
}

.title-con {
  padding: 2rem 1rem;
}

.title {
  border: 1px solid #868686;
  padding: 1rem;
}
.nav-con {
  border: 1px solid #999999;
  padding: 1rem;
  min-height: 4rem;
  flex-shrink: 0;
}
.cls-center {
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>
