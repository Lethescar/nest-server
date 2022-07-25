<!--
 * @Description: 文件 - 文件上传下载
 * @Autor: zhangdi
 * @Date: 2022-6-27 17:15:31
 * @LastEditors: zhangdi
-->
<template>
  <PageWrapper contentFullHeight>
    <Row :gutter="24">
      <Col :span="8">
        <p class="text-xl font-semibold">公共代码</p>
        <p>pool.js文件代码（与app.js同级）</p>
        <Textarea v-model:value="poolCode" autoSize class="!mb-4 !w-300px"></Textarea>
        <p>file.js接口文件代码，方法引入</p>
        <Textarea v-model:value="functionCode" autoSize class="!mb-4 !w-300px"></Textarea>
      </Col>
      <Col :span="8">
        <p class="text-xl font-semibold">上传到磁盘</p>
        <LocalUpload></LocalUpload>
      </Col>
      <Col :span="8">
        <p class="text-xl font-semibold">上传到数据库</p>
        <SqlUpload></SqlUpload>
      </Col>
    </Row>
  </PageWrapper>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import { Row, Col, Input } from 'ant-design-vue'
import { PageWrapper } from '/@/components/Page';
import LocalUpload from './components/CustomLocalUpload.vue'
import SqlUpload from './components/CustomSqlUpload.vue'

const Textarea = Input.TextArea;
const poolCode = ref(`//创建mysql连接池
const mysql = require('mysql');
var pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'lethe',
  connectionLimit: 20 
});
module.exports = pool;`)
const functionCode = ref(`const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')
const pool = require('../pool.js')`)
</script>

<style lang='less' scoped>
</style>