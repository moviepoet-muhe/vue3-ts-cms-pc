<template>
  <div class="permission">
    <div class="btns">
      <el-button type="primary" @click="dialogFormVisible = true">添加</el-button>
      <el-button type="primary" @click="handleExpandAll(true)">全部展开</el-button>
      <el-button type="primary" @click="handleExpandAll(false)">全部折叠</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tree"
      border
      style="width: 100%; margin-top: 12px;"
      row-key="id"
      :expand-row-keys="expandedRowKeys"
    >
      <!-- <el-table-column prop="id" /> -->
      <!-- 表格中列定义 -->
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <el-tag>{{ scope.row.type === 1 ? '菜单' : '按钮' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" />
      <el-table-column prop="rule" label="规则" />
      <el-table-column prop="order" label="排序" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-switch />
        </template>
      </el-table-column>
      <el-table-column prop="operations" label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑(添加/修改)菜单权限的对话框 -->
    <el-dialog v-model="dialogFormVisible" title="编辑菜单权限" width="500" :close-on-click-modal="false">
      <el-form :model="permission" :rules="validateRules" ref="formRef">
        <el-form-item label="父级" :label-width="formLabelWidth">
          <el-tree-select
            v-model="permission.pid"
            :data="tree"
            :props="{label: 'name'}"
            value-key="id"
            :render-after-expand="false"
            default-expand-all
            clearable
            placeholder="顶层"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="permission.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
          <el-radio-group v-model="permission.type">
            <el-radio :value="1">菜单</el-radio>
            <el-radio :value="2">功能</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规则" :label-width="formLabelWidth" prop="rule">
          <el-input v-model="permission.rule" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model.number="permission.order" autocomplete="off" />
        </el-form-item>
        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="permission.icon" autocomplete="off" />
          <el-icon>
            <component :is="permission.icon" />
          </el-icon>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch v-model="permission.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { addPermission, getAllPermissions, removePermission, updatePermission } from '@/api/permission'
import { convertToTree } from '@/utils/convert'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'

// 初始化菜单权限数据
const initPermissionData = () => ({
  name: '',
  type: 1,
  pid: '',
  rule: '',
  order: 0,
  icon: '',
  status: true,
})

// 扁平的菜单权限数据
const permissions = ref<Permission[]>()
// 树形结构的菜单权限数据
const tree = ref<any[]>()

// 所有展开的行id索引
const expandedRowKeys = ref<string[]>([])

// 编辑权限的表单引用
const formRef = ref<FormInstance>()
// 控制对话框显隐状态
const dialogFormVisible = ref(false)
// 表单中标签宽度
const formLabelWidth = '80px'
// 表单中的权限数据
const permission = ref<Partial<Permission>>(initPermissionData())
// 编辑权限时表单校验规则
const validateRules = {
  name: [
    { required: true, message: '权限名称必填!', trigger: 'blur', },
  ],
  type: [
    { required: true, message: '类型必选!', trigger: 'blur', },
  ],
  rule: [
    { required: true, message: '权限规则必填!', trigger: 'blur', },
  ],
}

/**
 * 查询所有菜单权限,注意，后端返回的数据是扁平结构的数据，但表格中要显示树形结构的数据，
 * 则需要将扁平结构的数据转换为树形结构
 */
const findAllPermissions = async () => {
  try {
    const res = await getAllPermissions()
    // console.log('所有菜单权限数据:', res)
    permissions.value = res.list
    // 将权限列表数据由扁平结构转换为树形结构
    tree.value = convertToTree(permissions.value)
    // console.log('树形结构数据:', tree.value)
  } catch (error) {
    console.error('查询菜单权限数据异常:', error)
  }
}
findAllPermissions()

/**
 * 处理表格操作列中的展开/折叠按钮逻辑
 */
const handleExpandAll = (isExpand: boolean) => {
  if (isExpand) {
    expandedRowKeys.value = permissions.value?.map(item => item.id) as string[]
  } else {
    expandedRowKeys.value = []
  }
}

/**
 * 编辑权限-确定按钮点击事件
 * 区分“确定”按钮的行为-新增/修改。
 * 可以通过 permission 中保存的对象是否具备 id 来区分。
 * 新增菜单权限时，permission 对象中没有 id。
 * 修改菜单权限时，permission 对象中是存在已知的 id 数据。
 */
const handleConfirm = async() => {
  // console.log('表单数据:', permission.value)
  
  try {
    // 点击确定按钮，先进行表单校验
    const res = await formRef.value?.validate()
    if (res) {
      // 表单校验通过，则获取表单数据，提交给后端处理
      console.log('数据:', permission.value)
      let result: Status | undefined
      if (permission.value.id) {
        // 有 id 则为修改
        result = await updatePermission(permission.value as Permission)
      } else {
        // 没有 id 则为新增(添加)
        result = await addPermission(permission.value)
      }

      console.log('编辑结果:', result)
      if (result.status === 200) {
        // 添加成功，关闭对话框，重置表单数据
        dialogFormVisible.value = false
        permission.value = initPermissionData()
        // 重新查询所有权限数据，响应式渲染
        findAllPermissions()
      } else {
        ElMessage.error(result.message)
      }
    }
  } catch (error) {
    console.error('表单提交异常:', error)    
  }
}

/**
 * 处理表格操作列中的修改按钮逻辑
 */
const handleEdit = (index: number, row: any) => {
  console.log('行索引:', index, ', 行数据:', row)
  // 打开编辑对话框
  dialogFormVisible.value = true
  // 将表单中绑定的数据设置为当前需要修改的权限行数据
  // 要将 row 对象中的数据复制一份，否则表单与表格中的数据
  // 是引用的同一份菜单权限数据，一处修改另一处会受影响
  permission.value = { ...row } // 浅克隆 ... / Object.assign()
}

/**
 * 处理表格操作列中的删除按钮逻辑
 */
 const handleDelete = async(index: number, row: any) => {
  console.log('行索引:', index, ', 行数据:', row)

  try {
    // 弹出确认删除提示框
    await ElMessageBox.confirm(
      '是否删除当前菜单权限?',
      '删除提示',
      {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
      }
    )
    // 确认删除，则发送网络请求
    const res = await removePermission(row.id)
    console.log('删除结果', res);
    // 删除后，刷新页面显示
    findAllPermissions()
  } catch (error) {
    console.error('错误:', error)
  }

  // ElMessageBox.confirm(
  //   '是否删除当前菜单权限?',
  //   '删除提示',
  //   {
  //     confirmButtonText: '是',
  //     cancelButtonText: '否',
  //     type: 'warning',
  //   }
  // )
  //   .then(() => {
  //     // 选择点击 "是" 按钮的回调
  //     // 发送网络请求，删除当前的权限

  //   })
  //   .catch(() => {
  //     // 选择点击 "否" 按钮的回调
  //     // ElMessage({
  //     //   type: 'info',
  //     //   message: 'Delete canceled',
  //     // })
  //   })
}
</script>

<style lang="less" scoped></style>
