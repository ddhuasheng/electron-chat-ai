<script setup lang="ts">
import {
  NScrollbar,
  NList,
  NListItem,
  NSpin,
  type ScrollbarInst,
} from "naive-ui";
import { ref, watch, nextTick, computed } from "vue";
import { storeToRefs } from "pinia";
import { MdPreview } from "md-editor-v3";
import { TextInput, Favorite, FileList } from "../index";
import { ComponentTypeEnum, RoleEnum } from '@/enums'
import { useLatelyDialogStore, useFavoriteStore } from "@/store";
import "md-editor-v3/lib/style.css";

const store = useLatelyDialogStore();
const { component } = storeToRefs(useFavoriteStore());
const { current, running, currentDialog } = storeToRefs(store);

const scrollbarRef = ref<ScrollbarInst>();

watch(
  () => currentDialog.value,
  () => {
    nextTick(() => {
      if(component.value === ComponentTypeEnum.CONTAINER) {
        scrollbarRef.value?.scrollTo({ top: 9999999 });
      }
    });
  }
);

const notContainer = computed(() => {
  return component.value !== ComponentTypeEnum.CONTAINER;
})
</script>

<template>
  <div class="py-[12px] px-[24px]" :class="{ 'bg-[#f9fafb]': notContainer }">
    <n-scrollbar
      ref="scrollbarRef"
      :style="{
        maxHeight: `calc(100vh - 24px - ${notContainer ? '0' : '80px'})`,
        height: `calc(100vh - 24px - ${notContainer ? '0' : '80px'})`,
      }"
    >
      <n-list
        style="height: 100%; --n-text-color: #333; --n-color: #fff"
        v-if="component === ComponentTypeEnum.CONTAINER"
      >
        <template #header>
          <div>
            {{ current?.name }}
          </div>
        </template>

        <n-list-item v-for="(item, index) in current?.history" :key="index">
          <md-preview
            v-if="item.role !== RoleEnum.ROLE_USER"
            v-model:model-value="item.content"
            :editor-id="`editor-${index}`"
            noIconfont
          />
          <div v-else class="flex justify-end">
            <span
              class="px-[12px] py-[8px] rounded-[8px] bg-[rgba(0,0,0,.04)] text-[#333]"
            >
              {{ item.content }}
            </span>
          </div>
        </n-list-item>

        <n-list-item v-if="running">
          <n-spin show size="small" />
        </n-list-item>
      </n-list>

      <Favorite v-else-if="component === ComponentTypeEnum.FAVORITE" />

      <FileList v-else-if="component === ComponentTypeEnum.FILE" />
    </n-scrollbar>

    <TextInput v-if="!notContainer" />
  </div>
</template>

<style lang="less" scoped></style>
