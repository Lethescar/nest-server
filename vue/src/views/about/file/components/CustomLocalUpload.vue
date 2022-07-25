<!--
 * @Description: 上传到磁盘 及 下载
 * @Autor: zhangdi
 * @Date: 2022-6-27 17:15:32
 * @LastEditors: zhangdi
-->
<template>
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
    <a-button class="mt-4" @click="handleDownload">下载</a-button>
  </div>
  <div class="w-500px">
    <Collapse :bordered="false" :class="`${prefixCls}-collapse`" class="!mt-4">
      <CollapsePanel header="接口代码">
        <div class="pl-4">
          <div class="ml-4 mb-4">
            <p>file.js：</p>
            <Textarea v-model:value="fileCode" :rows="15"></Textarea>
          </div>
        </div>
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { Upload, Collapse, CollapsePanel, Input } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';
import { localUpload, downloadById } from '/@/api/upload'
import { downloadByUrl } from '/@/utils/file/download';
import { FileInfo } from '../data'
import { useDesign } from '/@/hooks/web/useDesign';

const { prefixCls } = useDesign('local-upload');
const UploadDragger = Upload.Dragger
const Textarea = Input.TextArea;
const fileList = ref<any[]>([]);
const fileCode = ref(`const localStorage = multer.diskStorage({
    // 上传文件目录
    destination: (req,file,path)=>{
        path(null,'public/uploads')
    },
    // 上传文件名称
    filename: (req,file,path)=>{
        path(null,file.originalname)
    }
})

// multer 配置
const localUpload = multer({
    storage:localStorage
})

// 上传接口
router.post('/localUpload', localUpload.single('file'), (req, res)=>{
    const { file } = req
    const url = 'http://127.0.0.1:8092/upload/'+ file.originalname
    const data = {
        url,
        path: file.path,
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
                code: 0, msg: '操作成功',data:url
            });
        }
    })
});

// 下载接口
router.get('/download',(req,res)=>{
    const id = req.query.id;
    const sql = 'select * from files where id=?'
    pool.query(sql,id,(err,result)=>{
        if (err) {
            res.send({
                code: 1, msg: err.message
            });
        }else{
            res.send({
                code: 0, msg: '操作成功',data: result[0]
            });
        }
    })
})`)

// 自定义上传
async function customRequest(file) {
  const form = new window.FormData()
  form.append('file', file.file)

  localUpload(form).then(res => {
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
  console.log(info);
};

// 下载
function handleDownload() {
  downloadById({ id: '1' }).then(res => {
    const { url = '' } = res
    downloadByUrl({ url: url })
  })
}
</script>

<style lang='less' scoped>
@prefix-cls: ~"@{namespace}-local-upload";
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