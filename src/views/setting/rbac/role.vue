<template>
  <div class="role">
    <div class="btns" style="margin-bottom: 12px;">
      <el-button type="primary" @click="dialogFormVisible = true">添加</el-button>
    </div>

    <TablePro :columns="columns" :request-api="getAllRoles" :pagination="false" @update="handleRoleUpdate"
      @remove="handleRoleRemove" ref="tableRef">
      <template #permissions="scope">
        <el-text line-clamp="2">
          {{ calcPermissionNames(scope.row.permissions) }}
        </el-text>
      </template>
      <template #createdAt="scope">
        <span>
          {{ scope.row.createdAt.replace('T', ' ').slice(0, -5) }}
        </span>
      </template>
      <template #status="scope">
        <el-switch :model-value="scope.row.status" />
      </template>
      <template #grant="scope">
        <el-button type="primary" size="small" @click="handleRoleGrant(scope.row)">授权</el-button>
      </template>
    </TablePro>

    <!-- 编辑(添加/修改)角色的对话框 -->
    <el-dialog v-model="dialogFormVisible" title="编辑角色" width="500" :close-on-click-modal="false">
      <el-form :model="role" :rules="validateRules" ref="formRef">
        <el-form-item label="名称" :label-width="80" prop="name">
          <el-input v-model="role.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" :label-width="80">
          <el-input v-model="role.description" autocomplete="off" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item label="状态" :label-width="80">
          <el-switch v-model="role.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 角色授权抽屉组件 -->
    <el-drawer v-model="drawerVisible" :direction="'rtl'">
      <template #header>
        <div style="font-size: 18px; font-weight: 700;">角色授权</div>
      </template>
      <template #default>
        <el-tree style="max-width: 600px" :data="permissionTree" show-checkbox node-key="id" :default-checked-keys="[]"
          :props="{ label: 'name' }" default-expand-all ref="treeRef" />
      </template>
      <template #footer>
        <div style="display: flex;">
          <el-checkbox label="全选" @change="handleCheckAll" />
          <div style="flex: auto">
            <el-button>取消</el-button>
            <el-button type="primary" @click="handleGrantOk">确定</el-button>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import TablePro from '@/components/table-pro/index.vue'
import { addRole, getAllRoles, removeRole, updateRole } from '@/api/role'
import { ref, watch } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { getAllPermissions } from '@/api/permission'
import { convertToTree, findLeafNodes } from '@/utils/convert'

const defaultRole = () => ({
  name: '',
  description: '',
  status: true,
})

/**
 * 表格列定义
 */
const columns = [
  { label: '序号', type: 'index', width: 60 },
  { label: '名称', prop: 'name', width: 120 },
  { label: '权限', prop: 'permissions', custom: true },
  { label: '描述', prop: 'description', width: 200 },
  { label: '创建时间', prop: 'createdAt', custom: true, width: 200 },
  { label: '状态', prop: 'status', custom: true, width: 80 },
  { label: '授权', prop: 'grant', custom: true, width: 80 },
]

// 表格对象引用
const tableRef = ref()

// 对话框显隐状态
const dialogFormVisible = ref<boolean>(false)
// 表单中收集的角色信息
const role = ref<Partial<Role>>(defaultRole())
// 表单校验规则
const validateRules = {
  name: [
    { required: true, message: '角色名称必填!', trigger: 'blur', }
  ],
}
// 表单组件实例引用
const formRef = ref<FormInstance>()

/**
 * 点击修改按钮
 */
const handleRoleUpdate = (row: any) => {
  dialogFormVisible.value = true
  role.value = { ...row }
}

/**
 * 点击删除按钮
 */
const handleRoleRemove = async (row: any) => {
  try {
    const res = await removeRole(row.id)
    if (res.status === 200) {
      tableRef.value.fetchData()
    }
  } catch (error) {
    console.error('删除数据异常:', error)
  }
}

/**
 * 处理对话框“确定”按钮点击逻辑
 */
const handleConfirm = async () => {
  try {
    // 表单校验
    await formRef.value?.validate()

    // 区分是新增还是修改，发送网络请求，进行后续处理
    let result: Status
    if (role.value.id) {
      // 有 id 则为修改
      result = await updateRole(role.value)
    } else {
      // 没有 id 则为新增
      result = await addRole(role.value)
    }

    if (result.status === 200) {
      // 操作成功，重新查询表格中数据，关闭对话框，将对话框中表单重置
      tableRef.value?.fetchData()
      dialogFormVisible.value = false
      role.value = defaultRole()
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('编辑角色异常:', error)
  }
}

// 监视 dialogFormVisible 的变化
watch(() => dialogFormVisible.value, (visible) => {
  // console.log('对话框显隐变化...', visible)
  // visible 为 false 则是关闭对话框，关闭对话框，应该将表单数据重置
  if (visible === false) {
    role.value = defaultRole()
  }
})

/******************************************/
/************授权处理相关逻辑*****************/
/******************************************/
// 所有权限
const allPermissions = ref<Permission[]>()
// 权限树
const permissionTree = ref()
// 树形控件组件对象引用
const treeRef = ref()
/**
 * 查询所有的菜单权限
 */
const fetchAllPermissions = async () => {
  try {
    // 查找所有权限，得到扁平数据
    const res = await getAllPermissions()
    allPermissions.value = res.list
    // 将扁平数据转树
    permissionTree.value = convertToTree(res.list)
    console.log(permissionTree.value)
  } catch (error) {

  }
}
fetchAllPermissions()

/**
 * 计算角色所有权限名称
 */
const calcPermissionNames = (permissions: string[]) => {
  return permissions.map(key => {
    const permission = allPermissions.value?.find(item => item.id === key)
    return permission?.name
  }).join(', ')
}

/**
 * 抽屉组件显隐状态
 */
const drawerVisible = ref<boolean>(false)
/**
 * 点击角色授权按钮
 */
let updatedRole: any // 用于缓存待授权修改的角色信息
const handleRoleGrant = (row: any) => {
  console.log('row:::', row);
  // 打开抽屉
  drawerVisible.value = true
  // 保存待修改的角色信息
  updatedRole = { ...row }
  // 设置树形控件回显修改角色的原有权限信息
  setTimeout(() => {
    // 查找权限树中所有的叶子节点
    const leaves = findLeafNodes(permissionTree.value)
    // 筛选出 row.permissions 数组中为叶子节点的 key
    const checkedKeys = row.permissions.filter((key: string) => leaves.findIndex(item => item.id === key) !== -1)
    // 回显
    treeRef.value.setCheckedKeys(checkedKeys)
  })
}

/**
 * 授权确定按钮点击
 */
const handleGrantOk = async () => {
  // 获取树形控件中勾选项和半选项数据信息
  const checkedKeys = treeRef.value.getCheckedKeys()
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys()
  // 构建修改角色的权限信息
  const permissions = checkedKeys.concat(halfCheckedKeys)
  updatedRole.permissions = permissions
  // 发送网络请求，修改角色信息
  try {
    // 网络请求
    const res = await updateRole(updatedRole)
    if (res.status === 200) {
      // 修改成功，则关闭抽屉，刷新表格
      drawerVisible.value = false
      tableRef.value.fetchData()
    }
  } catch (error) {

  }
}

/**
 * 全选授权项
 */
const handleCheckAll = (checked: boolean) => {
  const checkedKeys = checked ? allPermissions.value?.map(item => item.id) : []
  treeRef.value.setCheckedKeys(checkedKeys)
}
</script>

<style lang="less" scoped>
:deep(.el-drawer__header) {
  margin-bottom: 20px;
}
</style>
