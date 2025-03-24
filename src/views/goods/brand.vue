<template>
  <div class="brand">
    品牌管理
<!-- 
      :data-source="dataSource" -->

    <TablePro
      :columns="columns"
      :request-api="getBrands"
      @update="handleBrandUpdate"
      @remove="data => console.log('删除数据:', data)"
      ref="tableRef"
    >
      <template #name="scope">
        <el-tag>自定义的名称 {{ scope.row.name }}</el-tag>
      </template>
      <template #address="scope">
        <div>自定义的地址显示 {{ scope.row.address }}</div>
      </template>
    </TablePro>


    <div>表格中的数据:{{ tableRef?.tableData }}</div>
    <div>当前第{{ tableRef?.page }}页</div>
    <div>每页显示{{ tableRef?.pageSize }}条数据</div>
    <div><button @click="() => tableRef?.fetchData()">刷新</button></div>
  </div>
</template>

<script lang="ts" setup>
import TablePro from '@/components/table-pro/index.vue'
import { getBrands } from '@/api/brand'
import { ref } from 'vue'

const tableRef = ref<any>()

// // 示例数据
// const dataSource = [
//   {
//     date: '2016-05-03',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles 111',
//   },
//   {
//     date: '2016-05-02',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles 222',
//   },
//   {
//     date: '2016-05-04',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles 333',
//   },
//   {
//     date: '2016-05-01',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles 444',
//   },
// ]

// 表定义
const columns = [
  {label: '日期', prop: 'date'},
  {label: '名称', prop: 'name', custom: true}, // 带 custom 属性并且为 true 时，表示这一列需要自定义渲染
  {label: '地址', prop: 'address', custom: true},
]

const handleBrandUpdate = (brand: any) => {
  console.log('修改的品牌:', brand)
}
</script>

<style lang="less" scoped>

</style>
