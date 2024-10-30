<script setup lang="ts">
import { ref, h, computed } from "vue";
import dayjs from "dayjs";
import {
  NDataTable,
  type DataTableColumns,
  NPopconfirm,
  NEmpty,
  NSpace,
  NButton,
  NInput,
} from "naive-ui";
import { UploadFile } from "../index";
import { FileListVO } from "@/types";
import { useFavoriteStore, useLatelyDialogStore } from "@/store";
import { ComponentTypeEnum } from "@/enums";
import { useDialogUtils } from "@/hooks";
import { FileChatServices } from "@/apis";

const { success, warning } = useDialogUtils();
const { setComponent, setFileIds, setFileNames } = useFavoriteStore();
const { setCurrentDialog } = useLatelyDialogStore();

const records = ref<FileListVO[]>([]);

const columns: DataTableColumns<FileListVO> = [
  {
    type: "selection",
    width: 30,
    multiple: true,
    className: "select-column-custom",
  },
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
    title: "文件大小",
    key: "size",
    align: "center",
    render(row) {
      return (row.size / 1024).toFixed(2) + "KB";
    },
  },
  {
    title: "上传时间",
    key: "createTime",
    align: "center",
    render(row) {
      const time = Number(String(row.createTime).padEnd(13, "0"));

      return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    width: 120,
    render(row) {
      return h(NSpace, {}, [
        h(
          "span",
          {
            style: {
              color: "#1890ff",
              cursor: "pointer",
            },
            onClick: () => {
              setComponent(ComponentTypeEnum.CONTAINER);
              setFileIds([row.id]);
              setFileNames([row.name]);
              setCurrentDialog(null);
            },
          },
          "对话"
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: async () => {
              await FileChatServices.deleteFile(row.id);
              success("删除成功");
              init();
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
        ),
      ]);
    },
  },
];

const fileList = ref<FileListVO[]>([]);
const loading = ref(false);
const searchText = ref("");

const init = () => {
  loading.value = true;
  FileChatServices.getFileList()
    .then((res) => {
      fileList.value = res.files;
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleCheck = (_: any[], rows: any[]) => {
  records.value = [...rows];
};

const multipleChat = () => {
  if (records.value.length === 0) {
    warning("请选择文件");
    return;
  }

  setFileIds(records.value.map((item) => item.id));
  setFileNames(records.value.map((item) => item.name));
  setComponent(ComponentTypeEnum.CONTAINER);
  setCurrentDialog(null);
};

const data = computed(() => {
  if (searchText.value) {
    return fileList.value.filter((item) =>
      item.name.includes(searchText.value)
    );
  }

  return fileList.value;
});

init();
</script>

<template>
  <div>
    <div class="border-b flex justify-between gap-[20px]">
      <div class="flex-1">
        <n-input
          v-model:value="searchText"
          placeholder="搜索文件名"
          style="
            width: 100%;
            --n-text-color: #333;
            --n-placeholder-color: #333;
            --n-border: 1px solid #f2f2f5;
          "
        ></n-input>
      </div>
      <div class="flex justify-between gap-[10px]">
        <upload-file @finish="init" />
        <n-button
          @click="multipleChat"
          style="--n-text-color: #333; --n-border: 1px solid rgba(0, 0, 0, 0.1)"
          >多文件对话</n-button
        >
      </div>
    </div>

    <n-data-table
      :data="data"
      :loading="loading"
      :columns="columns"
      :bordered="false"
      :rowKey="(row) => row.id"
      style="
        --n-text-color: #333;
        --n-th-text-color: #333;
        --n-merged-th-color: #f3f4f6;
        --n-merged-border-color: none;
        --n-merged-td-color: #fff;
        --n-td-text-color: #333;
        --n-merged-td-color-hover: #f3f4f6;
        --n-icon-color: #333;
        --n-color-table: #fff;
        --n-merged-color-table: #fff;
      "
      @update:checked-row-keys="(keys, rows) => handleCheck(keys, rows)"
    >
      <template #empty>
        <n-empty
          description="暂无数据"
          style="--n-icon-color: #ccc; --n-text-color: #ccc"
        />
      </template>
    </n-data-table>
  </div>
</template>

<style lang="less" scoped>
.select-column {
  div {
    background-color: #fff;
  }
}
</style>
