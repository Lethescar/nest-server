<template>
  <a-upload
    :action="uploadUrl"
    listType="picture-card"
    v-model:fileList="imgFileList"
    :beforeUpload="beforeUpload"
    accept=".png, .jpg, .jpeg"
    @preview="handlePreview"
    @change="handleChange"
    :customRequest="customRequest"
  >
    <div v-if="imgFileList.length < fileListNum">
      <CloudUploadOutlined style="font-size: 30px" />
      <div class="ant-upload-text">上传图片</div>
    </div>
  </a-upload>
  <div>支持.jpg .png .jpeg 允许最大上传5M</div>
  <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>

<script lang="ts" setup>
import { watch, withDefaults } from 'vue';
import { Upload, Modal } from 'ant-design-vue';
import { ref } from 'vue';
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { useGlobSetting } from '/@/hooks/setting';
import { useMessage } from '/@/hooks/web/useMessage';
//import { getToken } from '/@/utils/auth';
//import { HttpRequestHeader } from 'ant-design-vue/lib/upload/interface';

//图片类型
interface DataType {
  data: string;
}
interface FileListType {
  uid: string;
  response: DataType;
  name: string;
  url: string;
}

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  percent?: number;
  url?: string;
  preview?: string;
  originFileObj?: any;
  type?: string;
  size: number;
}

const { createMessage } = useMessage();
const AUpload = Upload;
const AModal = Modal;
const { uploadUrl } = useGlobSetting();
const imgFileList = ref<FileListType[]>([]);
const previewVisible = ref<boolean>(false);
const previewImage = ref<string | undefined>('');
//const token = getToken() as string;
//const headersObj = ref<HttpRequestHeader>({ Authorization: token });

//父级参数
const props = withDefaults(
  defineProps<{
    fileList: Array<FileListType>;
    fileListNum?: number;
    customRequest?
  }>(),
  {
    fileListNum: 8,
  },
);
const emits = defineEmits(['handleChange']);

//监听上传成功后通过方法修改父级参数
function handleChange(fileData) {
  const { fileList } = fileData;
  emits('handleChange', fileList);
}

//监听父级参数改变时回显
watch(
  () => props.fileList,
  (newVal) => {
    imgFileList.value = newVal;
  },
  { immediate: true },
);

//关闭弹窗
const handleCancel = () => {
  previewVisible.value = false;
};
//弹窗
const handlePreview = async (file: any) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
};

//转成Base64
function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// 上传前校验
function beforeUpload(file: FileItem) {
  const isJpgOrPng = testCheck(file);
  return isJpgOrPng;
}
function testCheck(file: FileItem) {
  return new Promise<void>((resolve, reject) => {
    file.size / 1024 / 1024 < 5 ? resolve() : reject();
  }).then(
    () => { },
    () => {
      createMessage.warning('文件不可超过5M!');
      return Promise.reject();
    },
  );
}
</script>
