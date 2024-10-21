<script setup lang="ts">
import { ref, computed } from "vue";
import { NEllipsis, NInput } from "naive-ui";
import { useIndexedDB } from "@/hooks";
import { latelyDialogState } from "@/types";
import { useLatelyDialogStore, useFavoriteStore } from "@/store";

const { addLatelyList, setCurrentDialog, findIndexLatelyDialog } =
  useLatelyDialogStore();
const { setActiveFavorite } = useFavoriteStore();
const list = ref<latelyDialogState[]>([]);
const { getAll } = useIndexedDB("favorite");

const search = ref()

const clickHandle = (item: latelyDialogState) => {
  const index = findIndexLatelyDialog(item.id);

  if (index !== -1) {
    setCurrentDialog(index);
  } else {
    addLatelyList(item.id, item.name, item.history);
    setCurrentDialog(0);
  }
  setActiveFavorite(false);
};

const init = async () => {
  const data = (await getAll()) as unknown as latelyDialogState[];
  list.value = data.map((item) => {
    return {
      ...item,
      history: JSON.parse(item.history as any),
    };
  });
};

const filterList = computed(() => {

  if (!search.value) {
    return list.value;
  }

  return list.value.filter((item) => {
    return item.name.includes(search.value);
  })
})

init();
</script>

<template>
  <div>
    <div>
      <n-input v-model:value="search" clearable autofocus placeholder="请输入搜索内容" style="--n-text-color:#333; width: 40%;--n-placeholder-color:#333;--n-border: 1px solid #f2f2f5"></n-input>
    </div>
    <div class="grid grid-cols-4 gap-[10px] mt-[12px]">
      <div
        v-for="item in filterList"
        @click="clickHandle(item)"
        :key="item.id"
        class="px-[12px] py-[8px] rounded-[12px] h-[150px] bg-[#fff] cursor-pointer"
      >
        <div class="text-[#333] font-bold text-[16px]">
          <n-ellipsis :line-clamp="1">{{ item.name }}</n-ellipsis>
        </div>
        <div>
          <n-ellipsis :line-clamp="5">
            <div
              v-for="(history, index) in item.history.slice(0, 1)"
              :key="index"
            >
              {{ history.content }}
            </div>
            <template #tooltip>
              <div style="text-align: center">
                请点击查看更多
              </div>
            </template>
          </n-ellipsis>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
