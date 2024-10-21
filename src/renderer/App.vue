<script setup lang="ts">
import {
  NConfigProvider,
  zhCN,
  dateZhCN,
  darkTheme,
  NDialogProvider,
  NMessageProvider,
} from "naive-ui";
import { Sider, Container } from "@/components";

</script>

<template>
  <n-config-provider :theme="darkTheme" :locale="zhCN" :date-locale="dateZhCN">
    <n-dialog-provider>
      <n-message-provider>
        <div class="w-[100%] h-[100vh] flex">
          <Sider />
          <Container class="flex-1" />
        </div>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped></style>
