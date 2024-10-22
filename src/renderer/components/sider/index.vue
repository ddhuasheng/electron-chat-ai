<script setup lang="ts">
import { NIcon } from "naive-ui";
import { storeToRefs } from 'pinia'
import { LatelyDialog } from "../index";
import { useLatelyDialogStore, useFavoriteStore } from "@/store";
import { Add } from "@vicons/ionicons5";

const { setCurrentDialog } = useLatelyDialogStore();
const store = useFavoriteStore();
const { isActiveFavorite } = storeToRefs(store);

const operHandle = (isFavorite: boolean) => {
  setCurrentDialog(null);
  store.setActiveFavorite(isFavorite)
};

</script>

<template>
  <div class="container">
    <div>
      <div class="add" @click="operHandle(false)">
        <NIcon size="20" color="#1890ff">
          <Add />
        </NIcon>
        <span>新对话</span>
      </div>
    </div>

    <LatelyDialog />
    
    <div class="mt-[24px] px-[8px] py-[8px] rounded-[12px] cursor-pointer hover:bg-[#f0f2f5]" :class="`${isActiveFavorite ? 'bg-[#fff]' : ''}`" @click="operHandle(true)">我的收藏</div>
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
}
</style>
