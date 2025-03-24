<template>
  <div class="table-pro">
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border stripe>
      <el-table-column v-for="(col, index) in columns" :key="index" v-bind="col">
        <!-- 插槽，用于自定义列的渲染，并将组件中的数据通过插槽向父组件传递(作用域插槽) -->
        <template v-if="col.custom" v-slot:default="scope">
          <slot :name="col.prop" v-bind="scope"></slot>
        </template>
      </el-table-column>

      <el-table-column label="操作" pro="operations" fixed="right" width="160">
        <template v-slot:default="scope">
          <el-button type="primary" size="small" @click="emit('update', scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination v-if="pagination !== false" background layout="prev, pager, next, sizes, ->, jumper, total"
      :total="total" size="small" :page-sizes="[5, 10, 20, 50, 100]" style="margin-top: 12px;"
      v-model:page-size="pageSize" v-model:current-page="page" @change="handlePageChange" />
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue';

/**
 * 封装表格通用业务组件，整合 table 与 pagination 组件一起使用。
 * 通常从以下几个方面考虑组件的可复用性，可维护性，易用性等:
 * 1. props(属性)
 * 2. emits(事件)
 * 3. slot(插槽)
 * 4. exposes(向外暴露的方法)
 */

/**
 * 1. props
 */
const props = defineProps<{
  dataSource?: any[], // 表格中显示的数据源
  columns: any[], // 定义表格中各列的特征
  pagination?: any, // 分页器配置
  requestApi?: (...args: any[]) => void, // 查询数据的请求接口
}>()

/**
 * 2. emits
 */
const emit = defineEmits<{
  update: [row: any], // 修改数据
  remove: [row: any], // 删除数据
}>()

/**
 * 删除逻辑
 */
const handleRemove = async (row: any) => {
  try {
    // 删除前的二次确认
    await ElMessageBox.confirm(
      '是否删除当前行数据?',
      '删除提示',
      {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
      }
    )
    // 确认删除
    emit('remove', row)
  } catch (error) {

  }
}

/**
 * 表格中数据源逻辑，如果属性中有接收到 requestApi 则发送网络请求查询，如果
 * 没有接收到 requestApi 则直接使用属性 dataSource。
 * 如果调用的是 requestApi 查询数据，则通常后端会向前端返回的业务数据格式为:
 * { list: any[], page: number, pageSize: number, total: number, isEnd: boolean }
 * list 表示当前页面查询的列表数据
 * page 表示当前页码
 * pageSize 表示每页记录数
 * total 表示总数据量
 * isEnd 表示是否所有数据全部查询结束
 */
const tableData = ref()
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
// 查询数据
const fetchData = async () => {
  try {
    if (props.requestApi) {
      const result: any = await props.requestApi({ page: page.value, pageSize: pageSize.value })
      tableData.value = result.list
      total.value = result.total
    }
  } catch (error) {
    console.log('查询数据异常:', error)
  }
}
// 初始化处理
const init = () => {
  // 如果有 requestApi 则查询数据
  if (props.requestApi) {
    fetchData()
  } else {
    tableData.value = props.dataSource ?? []
  }
}
init()

/**
 * 翻页功能实现
 */
const handlePageChange = () => {
  fetchData()
}

/**
 * 4. 向外暴露组件内部的数据与方法
 */
defineExpose({
  tableData,
  page,
  pageSize,
  fetchData,
})
</script>

<style lang="less" scoped></style>
