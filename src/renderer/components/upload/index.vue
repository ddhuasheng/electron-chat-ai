<script setup lang="ts">
import { NUpload, NButton, NIcon, type UploadFileInfo } from "naive-ui";
import { uploadFile } from '@/apis'
import { useDialogUtils } from '@/hooks'
import { UploadOutlined } from "@vicons/antd";

const emits = defineEmits<{
  (e: "finish", value: string): void;
}>()

const { success } = useDialogUtils()

const beforeUploadHandle = async (options: { file: UploadFileInfo, fileList: UploadFileInfo[] }) => {
  const formData = new FormData();
  formData.append('file', options.file.file as File);
  const res = await uploadFile(formData)

  emits('finish', res.fileId)

  success('上传成功')
};
</script>

<template>
  <n-upload :default-upload="false" @before-upload="beforeUploadHandle" :file-list="[]">
    <n-button
      style="--n-text-color: #333; --n-border: 1px solid rgba(0, 0, 0, 0.1)"
      >选择文件
      <template #icon>
        <n-icon size="14" color="#333">
          <UploadOutlined />
        </n-icon>
      </template>
    </n-button>
  </n-upload>
</template>

<style lang="less" scoped></style>
