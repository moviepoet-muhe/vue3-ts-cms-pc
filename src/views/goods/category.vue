<template>
  <div class="goods-category">
    <TablePro
      :data-source="dataSource"
      :columns="columns"
      @remove="data => console.log('删除数据:', data)"
      :pagination="false"
    />
  </div>
</template>

<script lang="ts" setup>
import TablePro from '@/components/table-pro/index.vue'

// 示例数据
const dataSource = [
  {
    date: '2016-06-03',
    name: 'Jerry',
    address: 'No. 189, Grove St, Los Angeles',
    createdAt: '2021-05-24 13:24:43',
  },
  {
    date: '2018-05-02',
    name: 'Lucy',
    address: 'No. 189, Grove St, Los Angeles',
    createdAt: '2021-05-24 13:24:43',
  },
  {
    date: '2017-05-04',
    name: 'Kitty',
    address: 'No. 189, Grove St, Los Angeles',
    createdAt: '2021-05-24 13:24:43',
  },
  {
    date: '2021-05-01',
    name: 'Jhon',
    address: 'No. 189, Grove St, Los Angeles',
    createdAt: '2021-05-24 13:24:43',
  },
]

// 表定义
const columns = [
  {label: '日期', prop: 'date'},
  {label: '名称', prop: 'name'},
  {label: '地址', prop: 'address'},
  {label: '创建时间', prop: 'createdAt'},
]
</script>

<style lang="less" scoped>

</style>
