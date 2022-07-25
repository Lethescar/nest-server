<!--
 * @Description: 上传到数据库 及 下载
 * @Autor: zhangdi
 * @Date: 2022-6-27 17:17:18
 * @LastEditors: zhangdi
-->
<template>
  <div>
    <div class="w-300px">
      <UploadDragger
        v-model:file-list="fileList"
        name="file"
        :multiple="true"
        @change="handleChange"
        :customRequest="customRequest"
      >
        <Icon icon="material-symbols:drive-folder-upload" size="64" color="#40a9ff" />
        <p class="ant-upload-text">点击或拖拽文件到此处上传</p>
        <p class="ant-upload-hint">支持批量上传</p>
      </UploadDragger>
      <a-button class="mt-4" @click="handleDownloadBySql">下载</a-button>
    </div>
    <div class="w-500px">
      <Collapse :bordered="false" :class="`${prefixCls}-collapse`" class="!mt-4">
        <CollapsePanel header="接口代码">
          <div class="pl-4">
            <div class="ml-4 mb-4">
              <p>接口文件file.js：</p>
              <Textarea v-model:value="fileCode" :rows="15"></Textarea>
            </div>
          </div>
        </CollapsePanel>
      </Collapse>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { Upload, Collapse, CollapsePanel, Input } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';
import { useMessage } from '/@/hooks/web/useMessage';
import { upload } from '/@/api/upload'
import { downloadByUrl } from '/@/utils/file/download';
import { FileInfo } from '../data'
import { useDesign } from '/@/hooks/web/useDesign';

const { prefixCls } = useDesign('sql-upload');
const UploadDragger = Upload.Dragger
const Textarea = Input.TextArea;
const { createMessage } = useMessage();
const fileList = ref([]);
const fileCode = ref(`const storage = multer.memoryStorage()
const upload = multer({storage: storage})

// 上传接口
router.post('/upload', upload.single('file'), (req, res)=>{
    const file = req.file
    const data = {
        buffer: file.buffer,
        name: file.originalname
    }
    const sql = 'insert into files set ?'
    pool.query(sql,data,(err,result)=>{
        if (err) {
            res.send({
                code: 1, msg: err.message
            });
        }else{
            res.send({
                code: 0, msg: '操作成功'
            });
        }
    })
});

// 下载接口
router.get('/downloadBySql/:id',(req,res)=>{
    const sql = 'select * from files where id = ?'
    pool.query(sql,id,(err,result)=>{
        if (err) {
            res.send(err.message)
        }else{
              res.set({
                'Content-Type': 'image/jpeg',
                'Accept-Ranges': 'bytes',
                'Content-Disposition': 'attachment; filename=' + result[0].name
            })
            res.send(result[0].buffer)
        }
    })
})`)

// 自定义上传
async function customRequest(file) {
  const form = new window.FormData()
  form.append('file', file.file)

  upload(form).then(res => {
    if (res) {
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
    // console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    createMessage.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    createMessage.error(`${info.file.name} file upload failed.`);
  }
};

// 下载
function handleDownloadBySql() {
  downloadByUrl({ url: 'http://127.0.0.1:3000/file/downloadBySql/2' })
}
</script>

<style lang='less' scoped>
@prefix-cls: ~"@{namespace}-sql-upload";
.@{prefix-cls} {
  &-collapse {
    ::v-deep(.ant-collapse-header) {
      padding: 6px 10px !important;
      padding-left: 10px !important;
    }
    ::v-deep(.ant-collapse-item) {
      border-bottom: 0px;
      border: 1px solid #d9d9d9;
    }
  }
}
</style>