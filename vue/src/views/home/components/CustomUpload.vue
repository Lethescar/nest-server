<!--
 * @Description: 自定义上传
 * @Autor: zhangdi
 * @Date: 2022-6-23 17:52:36
 * @LastEditors: zhangdi
-->
<template>
  <div>
    <Upload
      v-model:file-list="fileList"
      name="file"
      :multiple="true"
      @change="handleChange"
      :customRequest="customRequestLocal"
    >
      <a-button>上传到磁盘</a-button>
    </Upload>
    <Upload
      v-model:file-list="fileList"
      name="file"
      :multiple="true"
      @change="handleChange"
      :customRequest="customRequest"
    >
      <a-button>上传数据库</a-button>
    </Upload>
    <a-button @click="handleDownload">下载</a-button>
    <a-button @click="handleDownloadBySql">从数据库下载</a-button>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { Upload } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { upload, localUpload } from '/@/api/upload'
import { downloadByUrl } from '/@/utils/file/download';

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

const { createMessage } = useMessage();
const fileList = ref([]);

// 自定义上传磁盘
async function customRequestLocal(file) {
  const form = new window.FormData()
  form.append('file', file.file)

  localUpload(form).then(res => {
    if (res.code === 0) {
      file.onSuccess(res, file.file)
      file.status = 'done'
    } else {
      file.onError()
      file.status = 'error'
    }
  })
}
// 自定义上传数据库
async function customRequest(file) {
  const form = new window.FormData()
  form.append('file', file.file)

  upload(form).then(res => {
    if (res.code === 0) {
      file.onSuccess(res, file.file)
      file.status = 'done'
    } else {
      file.onError()
      file.status = 'error'
    }
  })
}

const handleChange = (info: FileInfo) => {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    createMessage.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    createMessage.error(`${info.file.name} file upload failed.`);
  }
};

// 下载
function handleDownload() {
  downloadByUrl({ url: 'http://127.0.0.1:3000/upload/download' })
}

// 从数据库下载
function handleDownloadBySql() {
  downloadByUrl({ url: 'http://127.0.0.1:3000/upload/downloadBySql' })
}
</script>

<style lang='less' scoped>
</style>