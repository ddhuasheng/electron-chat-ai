<script setup lang="ts">
import { NIcon } from "naive-ui";
import { storeToRefs } from "pinia";
import { LatelyDialog } from "../index";
import { useLatelyDialogStore, useFavoriteStore } from "@/store";
import { ComponentTypeEnum } from "@/enums";
import { Add } from "@vicons/ionicons5";
import { FileSearchOutlined, DropboxOutlined } from "@vicons/antd";

const { setCurrentDialog } = useLatelyDialogStore();
const store = useFavoriteStore();
const { component } = storeToRefs(store);

const operHandle = (type: ComponentTypeEnum) => {
  if (type === ComponentTypeEnum.CONTAINER) {
    store.setFileIds([])
  }
  setCurrentDialog(null);
  store.setComponent(type);
};
</script>

<template>
  <div class="container">
    <div>
      <div class="add" @click="operHandle(ComponentTypeEnum.CONTAINER)">
        <NIcon size="20" color="#1890ff">
          <Add />
        </NIcon>
        <span>新对话</span>
      </div>
    </div>

    <LatelyDialog />

    <div>
      <div
        class="file"
        @click="operHandle(ComponentTypeEnum.FILE)"
        :class="`${component === ComponentTypeEnum.FILE ? 'bg-[#fff]' : ''}`"
      >
        <NIcon size="16" color="#333" class="mr-[8px]">
          <FileSearchOutlined />
        </NIcon>
        <span>文件</span>
      </div>
    </div>

    <div
      class="mt-[12px] px-[8px] py-[8px] rounded-[12px] cursor-pointer flex items-center hover:bg-[#f0f2f5]"
      :class="`${component === ComponentTypeEnum.FAVORITE ? 'bg-[#fff]' : ''}`"
      @click="operHandle(ComponentTypeEnum.FAVORITE)"
    >
      <NIcon size="16" color="#333" class="mr-[8px]">
        <DropboxOutlined />
      </NIcon>
      我的收藏
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 240px;
  background: #f3f4f6;
  padding: 12px;
  height: 100%;
  .add {
    display: flex;
    padding: 6px 8px;
    color: #1890ff;
    background: rgba(0, 102, 255, 0.1);
    border-radius: 20px;
    cursor: pointer;
  }

  .file {
    display: flex;
    padding: 8px;
    border-radius: 20px;
    cursor: pointer;
    align-items: center;
    border-radius: 12px;
    margin-top: 12px;
  }
  .file:hover {
    background: #f0f2f5;
  }
}
</style>
