# 电商管理系统

示例: [https://www.likeshop.cn/product_demo_center](https://www.likeshop.cn/product_demo_center)

后端接口文档: [http://113.45.10.129:5945/swagger](http://113.45.10.129:5945/swagger)

技术栈: vite + vue3.x + vue-router + pina + typescript + axios + echarts + ES6 + ......

## 搭建项目基本结构

1. 利用 Vite 搭建项目基本结构
2. 项目常见目录结构

```bash
|-- public 		静态资源，不会被构建工具处理
|-- src    		源代码目录
	|-- api			网络请求
	|-- assets	静态媒体资源，这是会被构建处理
	|-- components	公共组件
	|-- router	路由配置相关
	|-- store		状态管理相关
	|-- views		页面级组件
	|-- utils		辅助工具类
	|-- plugins
	|-- directives
	|-- App.vue	根组件
	|-- main.ts	入口文件
```

3. 安装配置 linter/formmater 工具，用于**代码风格检查与代码格式化**
   1. ESLint
   2. StyleLint
   3. CommitLint
   4. Prettier
   5. husky
   6. lint-staged
4. 安装 normalize.css 包，用于统一处理不同浏览器间的默认样式

```bash
$ npm i normalize.css
```

5. 安装配置路由与状态管理库
6. 安装 axios 并二次封装

7. 安装 UI 组件库 element-plus
8. 搭建主页面的布局框架
9. 



