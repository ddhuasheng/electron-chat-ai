<script setup lang="ts">
import { NInput, NButton } from "naive-ui";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { Message } from "@/utils";
import { RoleEnum } from "@/enums";
import { ChatServices, FileChatServices } from "@/apis";
import { useLatelyDialogStore, useFavoriteStore } from "@/store";

const store = useLatelyDialogStore();
const { fileIds } = storeToRefs(useFavoriteStore());

const { currentDialog, current, running } = storeToRefs(store);

const value = ref("");

const system = Message[RoleEnum.ROLE_SYSTEM]();

const submit = () => {
  if (!value.value || running.value) {
    return;
  }

  const userMessage = Message[RoleEnum.ROLE_USER](value.value);
  value.value = "";

  if (!fileIds.value.length) {
    if (currentDialog.value === null) {
      const now = Date.now();
      const name = "新对话-" + now;
      store.addLatelyList(now, name, [system, userMessage]);
      currentDialog.value = 0;
    } else {
      store.putLatelyList(userMessage);
    }
  }

  store.setRunning(true);

  if (current.value.history.length === 1 && fileIds.value.length) {
    FileChatServices.FileChat({
      fileIds: fileIds.value,
      history: current.value.history,
      id: current.value.id,
    })
      .then((res) => {
        const now = Date.now();
        const name = "新对话-" + now;

        res.fileContents.forEach((item) => {
          if (currentDialog.value === null) {
            store.addLatelyList(
              now,
              name,
              [
                system,
                { ...Message[RoleEnum.ROLE_SYSTEM](item), isFile: true },
              ],
              true
            );
            currentDialog.value = 0;
          } else {
            store.putLatelyList(Message[RoleEnum.ROLE_SYSTEM](item), true);
          }
        });
        store.putLatelyList(userMessage);
        store.putLatelyList(Message[RoleEnum.ROLE_ASSISTANT](res.content));
      })
      .finally(() => {
        store.setRunning(false);
      });
  } else {
    ChatServices.chat(current.value)
      .then((res) => {
        store.putLatelyList(Message[RoleEnum.ROLE_ASSISTANT](res.content));
      })
      .finally(() => {
        store.setRunning(false);
      });
  }
};
</script>

<template>
  <n-input
    v-model:value="value"
    type="textarea"
    placeholder="请输入内容"
    autofocus
    :autosize="{
      minRows: 3,
      maxRows: 3,
    }"
    @keydown.enter="submit"
    style="
      --n-text-color: #333;
      --n-placeholder-color: #333;
      --n-border: 1px solid #f2f2f5;
    "
  >
    <template #suffix>
      <n-button type="primary" size="small" @click="submit">发送</n-button>
    </template>
  </n-input>
</template>

<style lang="less" scoped></style>
