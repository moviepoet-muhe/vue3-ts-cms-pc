<template>
  <div class="dashboard">
    <div style="width: 600px; height: 600px;" ref="lineRef"></div>
    <div style="width: 600px; height: 600px;" ref="pieRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
const lineRef = ref<HTMLElement>()
const pieRef = ref<HTMLElement>()

// 基于准备好的dom，初始化echarts实例
// 在生命周期钩子中使用
onMounted(() => {
  // 创建一个图表实例
  const lineChart = echarts.init(lineRef.value)
  // 绘制图表
  lineChart.setOption({
    // 标题
    title: {
      text: '主标题',
      subtext: '副标题'
    },
    // 提示框组件
    tooltip: {
      trigger: 'axis'
    },
    // X轴
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    // Y轴
    yAxis: {},
    // 数据序列
    series: [
      {
        name: '日销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      },
      {
        name: '周销量',
        type: 'bar',
        data: [10, 30, 78, 23, 20, 36]
      },
      {
        name: '月销量',
        type: 'line',
        data: [110, 120, 130, 140, 150, 160]
      }
    ]
  })

})

onMounted(() => {
  // 创建一个图表实例
  const pieChart = echarts.init(pieRef.value)
  // 绘制图表
  pieChart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '袜子' },
          { value: 735, name: '裤子' },
          { value: 580, name: '内裤' },
          { value: 484, name: '衣服' },
          { value: 300, name: '裙子' }
        ]
      }
    ]
  })
})

</script>

<style lang="less" scoped>
.dashboard {
  display: flex;
  justify-content: space-around;
}
</style>
