<template>
  <div class='map'>
    百度地图
    <div id="container" style="width: 600px; height: 600px;"></div>
  </div>
</template>

<script setup lang='ts'>
import { onMounted } from 'vue'

onMounted(() => {
  // 创建Map实例
  const map = new window.BMapGL.Map('container')
  // 初始化地图,设置中心点坐标和地图级别
  map.centerAndZoom(new window.BMapGL.Point(104.04766, 30.636829), 18)
  // 开启鼠标滚轮缩放
  map.enableScrollWheelZoom(true)
  // 创建点标记
  const marker = new BMapGL.Marker(new BMapGL.Point(104.04766, 30.636829), { enableDragging: true })
  // 在地图上添加点标记
  map.addOverlay(marker)

  const walking = new BMapGL.WalkingRoute(map, { renderOptions: { map: map, autoViewport: true } });
  walking.search('肖家河大厦', '春熙路');
})

</script>

<style lang='less' scoped></style>