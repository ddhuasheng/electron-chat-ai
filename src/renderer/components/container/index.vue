<script setup lang="ts">
import {
  NScrollbar,
  NList,
  NListItem,
  NSpin,
  NEllipsis,
  NIcon,
  NPopover,
  type ScrollbarInst,
} from "naive-ui";
import { ref, watch, nextTick, computed } from "vue";
import { storeToRefs } from "pinia";
import { MdPreview } from "md-editor-v3";
import { TextInput, Favorite, FileList } from "../index";
import { ComponentTypeEnum, RoleEnum } from "@/enums";
import { useLatelyDialogStore, useFavoriteStore } from "@/store";
import type { LatelyDialogHistoryState, SpeechReturnType } from "@/types";
import { useCopy, useDialogUtils, useSpeech } from "@/hooks";
import {
  CopyOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  RedoOutlined,
} from "@vicons/antd";
import "md-editor-v3/lib/style.css";
import { ChatServices } from "@/apis";
import { Message } from "@/utils";

const { copy } = useCopy();
const { speech } = useSpeech();
const { success } = useDialogUtils();
const store = useLatelyDialogStore();
const { component, fileNames, fileIds } = storeToRefs(useFavoriteStore());
const { current, running, currentDialog } = storeToRefs(store);

const scrollbarRef = ref<ScrollbarInst>();
const speechInstace = ref<SpeechReturnType>();

const copyHandle = (content: string) => {
  copy(content);
  success("复制成功");
};

const speak = (text: string) => {
  speechInstace.value = speech(text);

  speechInstace.value?.addEventListener("end", () => {
    speechInstace.value = undefined;
  });
};

const refreshHandle = () => {
  store.popLatelyList();
  store.setRunning(true);
  ChatServices.chat(current.value)
    .then((res) => {
      store.putLatelyList(Message[RoleEnum.ROLE_ASSISTANT](res.content));
    })
    .finally(() => {
      store.setRunning(false);
    });
};

watch(
  () => currentDialog.value,
  () => {
    nextTick(() => {
      if (component.value === ComponentTypeEnum.CONTAINER) {
        scrollbarRef.value?.scrollTo({ top: 9999999 });
      }
    });
  }
);

const notContainer = computed(() => {
  return component.value !== ComponentTypeEnum.CONTAINER;
});

const history = computed(() => {
  return current.value.history.filter(
    (item: LatelyDialogHistoryState) => !item.isFile
  );
});

const isRunning = computed(() => {
  if (!speechInstace.value) return false;

  return true;
});
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
          <div class="flex justify-between items-center border-b-[1px]">
            <n-ellipsis :line-clamp="1">
              {{ current?.name }}
            </n-ellipsis>
            <n-ellipsis
              :line-clamp="1"
              class="bg-[#f9fafb] px-[8px] py-[6px] rounded-[8px]"
            >
              {{ current.isFile || fileIds.length ? fileNames.join("、") : "" }}
            </n-ellipsis>
          </div>
        </template>

        <n-list-item v-for="(item, index) in history" :key="index">
          <div v-if="item.role !== RoleEnum.ROLE_USER">
            <md-preview
              v-model:model-value="item.content"
              :editor-id="`editor-${index}`"
              noIconfont
            />
            <div
              class="flex gap-[5px] px-[20px]"
              v-if="item.role === RoleEnum.ROLE_ASSISTANT"
            >
              <n-popover trigger="hover">
                <template #trigger>
                  <n-icon
                    color="#ccc"
                    size="16"
                    @click="copyHandle(item.content)"
                    class="cursor-pointer hover:bg-[rgba(0,0,0,.04)]"
                  >
                    <CopyOutlined />
                  </n-icon>
                </template>
                复制
              </n-popover>

              <n-popover trigger="hover">
                <template #trigger>
                  <n-icon
                    v-if="!isRunning"
                    color="#ccc"
                    size="16"
                    @click="speak(item.content)"
                    class="cursor-pointer hover:bg-[rgba(0,0,0,.04)]"
                  >
                    <PlayCircleOutlined />
                  </n-icon>
                  <n-icon
                    v-else
                    color="#ccc"
                    size="16"
                    class="cursor-pointer hover:bg-[rgba(0,0,0,.04)]"
                  >
                    <PauseCircleOutlined />
                  </n-icon>
                </template>
                语音播放
              </n-popover>

              <n-popover trigger="hover">
                <template #trigger>
                  <n-icon
                    @click="refreshHandle"
                    v-if="index === history.length - 1"
                    color="#ccc"
                    size="16"
                    class="cursor-pointer hover:bg-[rgba(0,0,0,.04)]"
                  >
                    <RedoOutlined color="#ccc" size="16" />
                  </n-icon>
                </template>
                重新生成
              </n-popover>
            </div>
          </div>
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
