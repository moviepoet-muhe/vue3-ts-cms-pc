<template>
  <div class="administrator">
    <div class="btns" style="margin-bottom: 12px;">
      <el-button type="primary" @click="dialogFormVisible = true">添加</el-button>
    </div>

    <!-- 表格 -->
    <TablePro :columns="columns" :request-api="getAllAdministrators" @update="handleAdminUpdate"
      @remove="handleAdminRemove" ref="tableRef">
      <template #avatarUrl="{ row }">
        <img :src="row.avatarUrl" alt="" style="width: 40px; height: 40px; border-radius: 50%;">
      </template>
      <template #roles="{ row }">
        {{row.roles?.map((role: Role) => role.name).join(', ')}}
      </template>
    </TablePro>

    <!-- 编辑(添加/修改)管理员的对话框 -->
    <el-dialog v-model="dialogFormVisible" title="编辑管理员" width="500" :close-on-click-modal="false">
      <el-form :model="admin" :rules="validateRules" ref="formRef">
        <el-form-item label="用户名" :label-width="80" prop="username">
          <el-input v-model="admin.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="80" prop="password" v-if="!admin.id">
          <el-input v-model="admin.password" autocomplete="off" type="password" show-password />
        </el-form-item>
        <el-form-item label="昵称" :label-width="80" prop="nickname">
          <el-input v-model="admin.nickname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="头像" :label-width="80" prop="avatarUrl">
          <el-upload class="avatar-uploader" :action="uploadAction" :headers="headers" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" name="avatar">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="电话" :label-width="80" prop="phone">
          <el-input v-model="admin.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色" :label-width="80" prop="roles">
          <el-select v-model="admin.roles" placeholder="请选择角色" clearable multiple>
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="80">
          <el-switch v-model="admin.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage, type FormInstance, type UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import TablePro from '@/components/table-pro/index.vue'
import { getAllAdministrators, addAdministrator, removeAdministrator, updateAdministrator } from '@/api/administrator'
import { getAllRoles } from '@/api/role'

// 表格列定义
const columns = [
  { label: 'ID', type: 'index', },
  { label: '用户名', prop: 'username', },
  { label: '昵称', prop: 'nickname', },
  { label: '头像', prop: 'avatarUrl', custom: true },
  { label: '角色', prop: 'roles', custom: true },
]

const defaultAdmin = () => {
  return {
    username: '',
    password: '',
    nickname: '',
    phone: '',
    roles: [],
    status: true,
    avatarUrl: '',
  }
}

// 表格对象引用
const tableRef = ref()

// 对话框显隐状态
const dialogFormVisible = ref<boolean>(false)
// 表单中收集的管理员信息
const admin = ref<Partial<Administrator>>(defaultAdmin())
// 表单校验规则
const validateRules = {
  username: [
    { required: true, message: '用户名必填!', trigger: 'blur', }
  ],
  password: [
    { required: !admin.value.id, message: '密码必填!', trigger: 'blur', }
  ],
}
// 表单组件实例引用
const formRef = ref<FormInstance>()

/**
 * 点击修改按钮
 */
const handleAdminUpdate = (row: any) => {
  dialogFormVisible.value = true
  admin.value = { ...row }
  admin.value.roles = row.roles?.map((role: Role) => role.id)
}
/**
 * 点击删除按钮
 */
const handleAdminRemove = async (row: any) => {
  try {
    const res = await removeAdministrator(row.id)
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
  // console.log('管理员数据:', admin.value);

  try {
    // 表单校验
    await formRef.value?.validate()

    // 区分是新增还是修改，发送网络请求，进行后续处理
    let result: Status
    if (admin.value.id) {
      // 有 id 则为修改
      result = await updateAdministrator(admin.value)
    } else {
      // 没有 id 则为新增
      result = await addAdministrator(admin.value)
    }

    if (result.status === 200) {
      // 操作成功，重新查询表格中数据，关闭对话框，将对话框中表单重置
      tableRef.value?.fetchData()
      dialogFormVisible.value = false
      admin.value = defaultAdmin()
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('编辑管理员异常:', error)
  }
}

/**
 * 查询所有系统角色信息
 */
const roles = ref<Role[]>([])
const fetchAllRoles = async () => {
  try {
    const res = await getAllRoles()
    roles.value = res.list
  } catch (error) {
    console.error('查询角色数据异常:', error)
  }
}
fetchAllRoles()

// 监视 dialogFormVisible 的变化
watch(() => dialogFormVisible.value, (visible) => {
  // console.log('对话框显隐变化...', visible)
  // visible 为 false 则是关闭对话框，关闭对话框，应该将表单数据重置
  if (visible === false) {
    admin.value = defaultAdmin()
  }
})

/*******************************************************/
/*******************文件上传相关**************************/
/*******************************************************/
// 后端接收文件上传的 url
const uploadAction = import.meta.env.VITE_UPLOAD_URL
// 请求头信息
const headers = {
  Authorization: `Bearer ${localStorage.getItem('token')}`,
}
const imageUrl = ref('')

/**
 * 文件上传成功处理逻辑
 * @param response 
 * @param uploadFile 
 */
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  if (response.code === 200) {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    admin.value.avatarUrl = response.data.avatar
  } else {
    ElMessage.error(response.message)
  }
  console.log('文件上传服务端响应结果:', response)
}

/**
 * 文件上传前的钩子
 * @param rawFile 
 */
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const type = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp']
  if (!type.includes(rawFile.type)) {
    ElMessage.error('仅能上传图片文件!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片文件大小限制在2MB以内!')
    return false
  }
  return true
}
</script>

<style lang="less" scoped>
.avatar-uploader .avatar {
  width: 81px;
  height: 81px;
  display: block;
}

:deep(.avatar-uploader .el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
