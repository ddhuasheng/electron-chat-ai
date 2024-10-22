<script setup lang="ts">
import { NInput, NButton } from "naive-ui";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { Message } from "@/utils";
import { RoleEnum } from "@/enums";
import { ChatServices } from "@/apis";
import { useLatelyDialogStore } from "@/store";

const store = useLatelyDialogStore();

const { currentDialog, current, running } = storeToRefs(store);

const value = ref("");

const system = Message[RoleEnum.ROLE_SYSTEM]();

const submit = () => {
  if (!value.value || running.value) {
    return;
  }

  if (currentDialog.value === null) {
    const now = Date.now();
    const name = "新对话-" + now;
    store.addLatelyList(now, name, [
      system,
      Message[RoleEnum.ROLE_USER](value.value),
    ]);
    currentDialog.value = 0;
  } else {
    store.putLatelyList(Message[RoleEnum.ROLE_USER](value.value));
  }

  value.value = "";
  store.setRunning(true);
  ChatServices.chat(current.value)
    .then((res) => {
      store.putLatelyList(Message[RoleEnum.ROLE_ASSISTANT](res.content));
    })
    .finally(() => {
      store.setRunning(false);
    });
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
