<template>
  <div class="dashboard">
    仪表盘

    <div style="width: 600px; height: 600px;" ref="lineRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
const lineRef = ref<HTMLElement>()

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
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  })

})

</script>

<style lang="less" scoped></style>
