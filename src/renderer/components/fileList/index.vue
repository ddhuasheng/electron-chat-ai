<script setup lang="ts">
import { ref, h } from "vue";
import dayjs from "dayjs";
import { NDataTable, type DataTableColumns, NPopconfirm, NEmpty } from "naive-ui";
import { UploadFile } from "../index";
import { FileListVO } from "@/types";
import { useDialogUtils } from '@/hooks'
import { getFileList, deleteFile } from "@/apis";

const { success } = useDialogUtils()

const columns: DataTableColumns<FileListVO> = [
  {
    title: "文件id",
    key: "id",
    align: "center",
  },
  {
    title: "文件名",
    key: "name",
    align: "center",
  },
  {
    title: "上传时间",
    key: "createTime",
    align: "center",
    render(row) {
      const time = String(row.createTime).padEnd(13, "0");

      return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    width: 80,
    render(row) {
      return h(
        NPopconfirm,
        {
          onPositiveClick: async () => {
            await deleteFile(row.id)
            success('删除成功')
            init()
          },
        },
        {
          trigger: h(
            "span",
            {
              style: {
                color: "#1890ff",
                cursor: "pointer",
              },
            },
            "删除"
          ),
          default: h("span", {}, "确定删除吗？"),
        }
      );
    },
  },
];

const fileList = ref<FileListVO[]>([]);
const loading = ref(false);

const init = () => {
  loading.value = true;
  getFileList()
    .then((res) => {
      fileList.value = res.files;
    })
    .finally(() => {
      loading.value = false;
    });
};

init();
</script>

<template>
  <div>
    <div class="border-b">
      <upload-file @finish="init" />
    </div>

    <n-data-table
      :data="fileList"
      :loading="loading"
      :columns="columns"
      :bordered="false"
      style="
        --n-text-color: #333;
        --n-th-text-color: #333;
        --n-merged-th-color: #f3f4f6;
        --n-merged-border-color: none;
        --n-merged-td-color: #fff;
        --n-td-text-color: #333;
        --n-merged-td-color-hover: #f3f4f6;
        --n-icon-color: #333; 
      "
    >
    <template #empty>
      <n-empty description="暂无数据" style="--n-icon-color: #ccc;--n-text-color:#ccc;"/>
    </template>
  </n-data-table>
  </div>
</template>

<style lang="less" scoped></style>
