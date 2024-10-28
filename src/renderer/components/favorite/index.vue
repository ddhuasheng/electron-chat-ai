<script setup lang="ts">
import { ref, computed } from "vue";
import { NEllipsis, NInput, NIcon, NDropdown } from "naive-ui";
import { useIndexedDB, useDialogUtils } from "@/hooks";
import { latelyDialogState } from "@/types";
import { useLatelyDialogStore, useFavoriteStore } from "@/store";
import { ComponentTypeEnum } from "@/enums";
import { shared } from "@/utils";
import { EllipsisHorizontal } from "@vicons/ionicons5";

const { addLatelyList, setCurrentDialog, findIndexLatelyDialog } =
  useLatelyDialogStore();
const { setComponent, setFileIds } = useFavoriteStore();
const list = ref<latelyDialogState[]>([]);
const { getAll, remove } = useIndexedDB("favorite");
const { confirm, success } = useDialogUtils();

const search = ref();
const options = [
  {
    label: "分享",
    key: "share",
  },
  {
    label: "删除",
    key: "remove",
  },
];

const clickHandle = (item: latelyDialogState) => {
  const index = findIndexLatelyDialog(item.id);

  if (index !== -1) {
    setCurrentDialog(item.id);
  } else {
    addLatelyList(item.id, item.name, item.history);
    setCurrentDialog(item.id);
  }
  setComponent(ComponentTypeEnum.CONTAINER);
  setFileIds([]);
};

const handleSelect = async (key: string, item: latelyDialogState) => {
  switch (key) {
    case "remove":
      confirm({
        type: "warning",
        title: "警告",
        content: "确定要删除吗？",
        onPositiveClick: async () => {
          await remove(item.id);
          success("删除成功");
          init();
        },
      });

      break;

    case "share":
      await shared(JSON.stringify(item));
      success("已复制分享链接");

      break;
  }
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
  });
});

init();
</script>

<template>
  <div>
    <div>
      <n-input
        v-model:value="search"
        clearable
        autofocus
        placeholder="请输入搜索内容"
        style="
          --n-text-color: #333;
          width: 40%;
          --n-placeholder-color: #333;
          --n-border: 1px solid #f2f2f5;
        "
      ></n-input>
    </div>
    <div class="grid grid-cols-4 gap-[10px] mt-[12px]">
      <div
        v-for="item in filterList"
        @click="clickHandle(item)"
        :key="item.id"
        class="px-[12px] py-[8px] rounded-[12px] h-[150px] bg-[#fff] cursor-pointer"
      >
        <div
          class="text-[#333] font-bold text-[16px] flex justify-between items-center"
        >
          <n-ellipsis :line-clamp="1">{{ item.name }}</n-ellipsis>
          <n-dropdown
            trigger="hover"
            :options="options"
            @select="(key) => handleSelect(key, item)"
          >
            <n-icon>
              <EllipsisHorizontal />
            </n-icon>
          </n-dropdown>
        </div>
        <div>
          <n-ellipsis :line-clamp="5">
            <div
              v-for="(history, index) in item.history.slice(2, 4)"
              :key="index"
            >
              {{ history.content }}
            </div>
            <template #tooltip>
              <div style="text-align: center">请点击查看更多</div>
            </template>
          </n-ellipsis>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
