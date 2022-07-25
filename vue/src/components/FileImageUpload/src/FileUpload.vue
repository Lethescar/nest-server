<template>
  <div>
    <a-upload-dragger
      v-model:file-list="imgFileList"
      name="file"
      :multiple="true"
      :action="uploadUrl"
      :headers="headersObj"
      accept=".png, .jpg, .jpeg, .doc, .docx, .xls, .xlsx, .text"
      @change="handleChange"
      :before-upload="beforeUpload"
    >
      <p class="ant-upload-drag-icon">
        <SvgIcon name="gonggong_shangchuan" size="50" />
      </p>
      <p class="ant-upload-text">
        将文件拖到此处，或<span style="color: #4d79ff">点击上传</span>
      </p>
      <p class="ant-upload-hint">
        支持扩展名：.png、.jpg、.jpeg、doc(.docx)、.xls(.xlsx)、.text允许最大上传50M
      </p>
    </a-upload-dragger>
  </div>
</template>
<script lang="ts" setup>
  import { Upload, message } from 'ant-design-vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { ref, watch } from 'vue';
  import { getToken } from '/@/utils/auth';
  import SvgIcon from '/@/components/Icon/src/SvgIcon.vue';
  import { HttpRequestHeader } from 'ant-design-vue/lib/upload/interface';

  interface DataType {
    data: string;
  }

  interface FileListType {
    uid: string;
    response: DataType;
    name: string;
    url: string;
  }

  const AUploadDragger = Upload.Dragger;
  const { uploadUrl } = useGlobSetting();
  const imgFileList = ref<FileListType[]>([]);
  const token = getToken() as string;
  const headersObj = ref<HttpRequestHeader>({ Authorization: token });
  // 父组件传值
  const props = defineProps<{
    fileList: Array<FileListType>;
  }>();

  //监听父级参数改变时回显
  watch(
    () => props.fileList,
    (newVal) => {
      imgFileList.value = newVal;
    },
    { immediate: true },
  );
  // 改变
  const emit = defineEmits(['handleChange']);
  function handleChange(value) {
    emit('handleChange', value);
  }

  function beforeUpload(file) {
    const isLt10M = file.size / 1024 / 1024 < 50;
    if (!isLt10M) {
      message.error('文件不可超过50M');
      return Promise.reject('文件不可超过50M');
    }
    return isLt10M;
  }
</script>
