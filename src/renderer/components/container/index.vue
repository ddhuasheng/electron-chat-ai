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
  useDialog,
} from "naive-ui";
import { ref, watch, nextTick, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { MdPreview } from "md-editor-v3";
import { TextInput, Favorite, FileList } from "../index";
import { ComponentTypeEnum, RoleEnum } from "@/enums";
import { useLatelyDialogStore, useFavoriteStore } from "@/store";
import type { LatelyDialogHistoryState, SpeechReturnType } from "@/types";
import { useCopy, useSpeech } from "@/hooks";
import {
  CopyOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  RedoOutlined,
} from "@vicons/antd";
import "md-editor-v3/lib/style.css";
import { ChatServices, utilServices } from "@/apis";
import { Message } from "@/utils";

const { copy } = useCopy();
const { speech } = useSpeech();

const store = useLatelyDialogStore();
const { component, fileNames, fileIds } = storeToRefs(useFavoriteStore());
const { current, running, currentDialog } = storeToRefs(store);

const scrollbarRef = ref<ScrollbarInst>();
const speechInstace = ref<SpeechReturnType>();
const isPause = ref(false);

const speak = (text: string) => {
  if (speechInstace.value) {
    speechInstace.value.speech();
  }

  speechInstace.value = speech(text);

  speechInstace.value?.addEventListener("end", () => {
    speechInstace.value = undefined;
  });

  speechInstace.value?.addEventListener("pause", () => {
    isPause.value = true;
  });

  speechInstace.value?.addEventListener("resume", () => {
    isPause.value = false;
  });

  speechInstace.value?.speech();
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

  return !isPause.value;
});

onMounted(async () => {
  // 是否是分享链接打开
  const searchParams = window.location.href.split("?")[1];
  const record = searchParams && searchParams.split("shareRecord=")[1];

  if (record) {
    const dialog = useDialog();
    const { destroy } = dialog.info({
      closable: false,
      closeOnEsc: false,
      maskClosable: false,
      content: () => "正在加载对话，请稍等...",
      action: () => "",
    });

    try {
      const tem = record.replace(" ", "+");
      const { text } = await utilServices.decompress(tem);
      const data = JSON.parse(text);

      const index = store.findIndexLatelyDialog(data.id);

      if (index === -1) {
        store.addLatelyList(data.id, data.name, data.history, data.isFile);
      }

      store.setCurrentDialog(data.id);
    } catch (e) {
      console.log("分享链接解析失败", e);
    } finally {
      destroy();
    }
  }
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
              v-if="current.isFile || fileIds.length"
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
                    @click="copy(item.content)"
                    class="cursor-pointer hover:bg-[rgba(0,0,0,.04)]"
                  >
                    <CopyOutlined />
                  </n-icon>
                </template>
                复制
              </n-popover>

              <n-popover trigger="hover" v-if="!isRunning">
                <template #trigger>
                  <n-icon
                    color="#ccc"
                    size="16"
                    @click="speak(item.content)"
                    class="cursor-pointer hover:bg-[rgba(0,0,0,.04)]"
                  >
                    <PlayCircleOutlined />
                  </n-icon>
                </template>
                语音播放
              </n-popover>

              <n-popover trigger="hover" v-else>
                <template #trigger>
                  <n-icon
                    color="#ccc"
                    size="16"
                    class="cursor-pointer hover:bg-[rgba(0,0,0,.04)]"
                  >
                    <PauseCircleOutlined />
                  </n-icon>
                </template>
                暂停播放
              </n-popover>

              <n-popover trigger="hover" v-if="index === history.length - 1">
                <template #trigger>
                  <n-icon
                    @click="refreshHandle"
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
