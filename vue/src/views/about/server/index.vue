<!--
 * @Description: nodejs后端服务
 * @Autor: zhangdi
 * @Date: 2022-6-27 10:15:53
 * @LastEditors: zhangdi
-->
<template>
  <PageWrapper contentFullHeight>
    <Row
      :class="`${prefixCls}-content`"
      class="m-4 p-4 flex justify-center items-center gap-6 rounded-3xl"
    >
      <Col :span="24">
        <p class="text-xl font-semibold">搭建基于nodejs的Express应用(服务)</p>
      </Col>
      <Col :span="24">
        <p>① 首先需要安装Node.js</p>
        <div class="pl-4">
          <p>Node.js中文网：http://nodejs.cn/</p>
        </div>
      </Col>
      <Col :span="24">
        <p>② 安装Express</p>
        <div class="pl-4">
          <p>基于 Node.js 平台，快速、开放、极简的 Web 开发框架</p>
          <div class="w-250px mb-2">
            <Textarea v-model:value="commandNode" autoSize class="!bg-transparent"></Textarea>
          </div>
        </div>
      </Col>
      <Col :span="24">
        <p>③ 通过 npm 安装 Express 应用程序生成器</p>
        <div class="pl-4">
          <div class="w-250px mb-2">
            <Textarea v-model:value="commandExpressGenerator" autoSize class="!bg-transparent"></Textarea>
          </div>
        </div>
      </Col>
      <Col :span="24">
        <p>④ 生成 Express 应用</p>
        <div class="pl-4">
          <div class="w-350px mb-2">
            <Textarea v-model:value="commandServer" autoSize class="!bg-transparent"></Textarea>
          </div>
          <p class="text-xs">注：此处'server'为应用名称，此处以此为例</p>
          <p>
            即会生成名称为
            <span class="font-semibold italic">server</span> 的 Express 应用
          </p>
          <p>通过生成器创建的应用一般都有如下目录结构：</p>
          <div class="w-350px mb-2">
            <Textarea v-model:value="commandCatalog" autoSize class="!bg-transparent"></Textarea>
          </div>
        </div>
      </Col>
      <Col :span="24">
        <p>⑤ 安装依赖</p>
        <div class="pl-4">
          <div class="w-350px mb-2">
            <Textarea v-model:value="commandInstall" autoSize class="!bg-transparent"></Textarea>
          </div>
          <p
            class="text-xs"
          >注：cors用来解决跨域问题；Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件（可参考https://www.npmjs.com/package/multer）；mysql模块用来操作MySql数据库。</p>

          <p>在app.js文件中引用cors</p>
          <div class="w-350px mb-2">
            <Textarea v-model:value="commandUseCors" autoSize class="!bg-transparent"></Textarea>
          </div>
        </div>
      </Col>
      <Col :span="24">
        <p>⑥ 启动应用</p>
        <div class="pl-4">
          <div class="w-350px mb-2">
            <Textarea v-model:value="commandStart" autoSize class="!bg-transparent"></Textarea>
          </div>
        </div>
      </Col>
    </Row>
  </PageWrapper>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import { Row, Col, Input } from 'ant-design-vue'
import { PageWrapper } from '/@/components/Page';
import { useDesign } from '/@/hooks/web/useDesign';

const { prefixCls } = useDesign('server');
const Textarea = Input.TextArea;
const commandNode = ref(`$ npm install express --save`)
const commandExpressGenerator = ref(`$ npm install -g express-generator`)
const commandServer = ref(`$ express server`)
const commandCatalog = ref(`.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.pug
    ├── index.pug
    └── layout.pug
7 directories, 9 files`)
const commandInstall = ref(`$ cd server
$ npm install
$ npm install cors --save
$ npm install multer --save
$ npm install mysql --save`)
const commandUseCors = ref(`const express = require('express');
const cors = require("cors");
...
var app = express();
app.use(cors());`)
const commandStart = ref(`$ npm start`)
</script>

<style lang='less' scoped>
@prefix-cls: ~"@{namespace}-server";
.@{prefix-cls} {
  &-content {
    backdrop-filter: blur(4px);
    background-color: #4ffbdf16;
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border: 0px rgba(255, 255, 255, 0.4) solid;
    border-bottom: 0px rgba(40, 40, 40, 0.35) solid;
    border-right: 0px rgba(40, 40, 40, 0.35) solid;
  }
}
</style>