<template>
  <div class='rich-editor'>
    <!-- <div id="toolbar-container" style="width: 600px; height: 160px;border: 1px solid"></div>
    <div id="editor-container" style="width: 600px; height: 600px;border: 1px solid"></div> -->

    <Toolbar style="border: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
    <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig" mode="default"
      @onCreated="handleCreated" />
  </div>
</template>

<script setup lang='ts'>
import '@wangeditor/editor/dist/css/style.css'
import { createEditor, createToolbar } from '@wangeditor/editor'
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

/* onMounted(() => {
  // 初始化编辑器
  const editor = createEditor({
    selector: '#editor-container',
  })
  // 初始化工具栏
  const toolbar = createToolbar({
    editor,
    selector: '#toolbar-container',
  })
}) */

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
  }, 1500)
})

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}


</script>

<style lang='less' scoped></style>