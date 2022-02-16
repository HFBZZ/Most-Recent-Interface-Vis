<template>
  <div style="display: flex">
    <div class="nav-con">
      <!-- <el-button type="primary" @click="back_click">导航按钮</el-button> -->
      
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="1"
        text-color="#fff"
      >
        <el-menu-item index="1" @click="back_click">
          <el-icon>
            <icon-menu />
          </el-icon>
          <span>Back to Main</span>
        </el-menu-item>
      </el-menu>
      <el-button @click="clickPause">{{ pauseOrResume[pauseFlag] }}</el-button><br>Note: pause to zoom
    </div>
    <div class="main">
      <!-- chart1 -->
      <div style="min-width: 1000px; width: 100%">
        <div style="width: 1500px; border: 1px solid #999999">
          <el-tag style="font-size: 1.5rem">Sys3_Out_PowerStorage</el-tag>
          <div id="chart1" style="width: 1500px; height: 400px"></div>
          <div
            class="cls-con"
            style="position: relative; top: -3rem; padding: 0 9rem 0 7rem"
          ></div>
        </div>
      </div>

      <!-- chart2 -->
      <div style="min-width: 1000px; width: 100%">
        <div style="width: 1500px; border: 1px solid #999999">
          <el-tag style="font-size: 1.5rem">Sys2_out_PowerConsumption</el-tag>
          <div id="chart2" style="width: 1500px; height: 400px"></div>
          <div
            class="cls-con"
            style="position: relative; top: -3rem; padding: 0 9rem 0 7rem"
          ></div>
        </div>
      </div>

      <!-- chart3 -->
      <div style="min-width: 1000px; width: 100%">
        <div style="width: 1500px; border: 1px solid #999999">
          <el-tag style="font-size: 1.5rem"
            >Sys2_out_InteriorWallSurfTemp_Sensors</el-tag
          >
          <div id="chart3" style="width: 1500px; height: 400px"></div>
          <div
            class="cls-con"
            style="position: relative; top: -3rem; padding: 0 9rem 0 7rem"
          ></div>
        </div>
      </div>

      <!-- chart4 -->
      <div style="min-width: 1000px; width: 100%">
        <div style="width: 1500px; border: 1px solid #999999">
          <el-tag style="font-size: 1.5rem">Sys5_Out_PowerRequest</el-tag>
          <div id="chart4" style="width: 1500px; height: 400px"></div>
          <div
            class="cls-con"
            style="position: relative; top: -3rem; padding: 0 9rem 0 7rem"
          ></div>
        </div>
      </div>

      <!-- chart5 -->
      <div style="min-width: 1000px; width: 100%">
        <div style="width: 1500px; border: 1px solid #999999">
          <el-tag style="font-size: 1.5rem">Sys5_Out_PowerConsumption</el-tag>
          <div id="chart5" style="width: 1500px; height: 400px"></div>
          <div
            class="cls-con"
            style="position: relative; top: -3rem; padding: 0 9rem 0 7rem"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import {
  Location,
  Document,
  Menu as IconMenu,
  Setting,
} from "@element-plus/icons-vue";

let charts: any[] = [];

@Options({
  components: {},
})
export default class Page2 extends Vue {
  pauseFlag = 0;
  pauseOrResume = ["Pause", "Resume"];
  mounted() {
    for (let c = 0; c < 5; c++) {
      // draw dom and start ws
      charts[c] = {
        chartId: "chart" + (c + 1),
        chart: {},
        xaxis: [],
        series: [],
      };
      charts[c].chart = this.$echarts.init(
        document.getElementById(charts[c].chartId)
      );
      this.init_ws(c);
    }
  }
  clickPause() {
    this.pauseFlag = 1 - this.pauseFlag;
  }
  init_ws(chart_id: number) {
    let ws = new WebSocket("ws://127.0.0.1:8888/ws/" + (chart_id + 3));
    // let ws = new WebSocket("ws://127.0.0.1:8888/ws/" +  (128));

    let obj = charts[chart_id];

    let arr: any[] = [];
    for (let i = 0; i < 1; i++) {
      obj.xaxis.push("");
      arr.push(0);
    }

    ws.onmessage = (evt: any) => {
      // console.log(evt.data);
      let res = JSON.parse(evt.data);

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

      // obj.xaxis.shift();
      obj.xaxis.push(res.simulink_time);

      for (var i = 0; i < res.data.length; i++) {
        // obj.series[i].data.shift();
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
  back_click() {
    // this.$router.go({name:"Home"});
    this.$router.replace({ path: '/' })
  }
}
</script>
<style scoped>
.main {
  display: flex;
  /* justify-content: center; */
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 0 1rem;
  /* align-items: center; */
}
.nav-con {
  border: 1px solid #999999;
  padding: 1rem;
  min-height: 4rem;
  flex-shrink: 0;
}
</style>
