<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, h } from "vue";
import {
  NCollapse,
  NCollapseItem,
  NIcon,
  NEllipsis,
  NDropdown,
  NEmpty,
  NInput,
} from "naive-ui";
import { useLatelyDialogStore, useFavoriteStore } from "@/store";
import { useIndexedDB, useDialogUtils } from "@/hooks";
import { ComponentTypeEnum } from '@/enums'
import {
  CaretForward,
  CaretDownOutline,
  EllipsisHorizontal,
} from "@vicons/ionicons5";
import { latelyDialogState } from "@/types";

const store = useLatelyDialogStore();
const { setComponent, setFileIds } = useFavoriteStore()

const { latelyList, currentDialog } = storeToRefs(store);
const isExpanded = ref(true);
const name = ref<string>();
const { success, confirm, warning } = useDialogUtils()
const db = useIndexedDB("favorite");

const options = [
  {
    label: "收藏",
    key: "favorite",
  },
  {
    label: "重命名",
    key: "rename",
  },
  {
    label: "删除",
    key: "remove",
  },
];

const updateHandle = (name: string[]) => {
  isExpanded.value = !!name.length;
};

const clickHandle = (id: number) => {
  store.setCurrentDialog(id);
  setComponent(ComponentTypeEnum.CONTAINER)
  setFileIds([])
};

const handleSelect = (key: string, item: latelyDialogState) => {
  switch (key) {
    case "rename":
      name.value = item.name;
      store.setCurrentDialog(item.id);
      setComponent(ComponentTypeEnum.CONTAINER)
      setFileIds([])
      confirm({
        title: '重命名',
        content: () => h(NInput, {
          value: name.value,
          onUpdateValue: (value: string) => {
            name.value = value
          }
        }),
        onPositiveClick: () => {
          if (name.value) {
            store.setName(item.id, name.value)
            name.value = "";
          }
        }
      })
      break;
    case "remove":
      confirm({
        type: "warning",
        title: "警告",
        content: "确定要删除吗？",
        onPositiveClick: () => {
          if (latelyList.value.length === 1) {
            store.setCurrentDialog(null)
          } else if(item.id === currentDialog.value) {
            store.setCurrentDialog(item.id)
          }
          setFileIds([])
          setComponent(ComponentTypeEnum.CONTAINER)
          store.removeLatelyList(item.id);
        },
      });
      break;
    case "favorite":
      const id = item.id;
      db.get(id).then((res) => {
        if (res) {
          warning("该对话已收藏！！！");
          return;
        }

        db.add({
          ...item,
          history: JSON.stringify(item.history),
        });
        success("收藏成功");
      });
      break;
  }
};

</script>

<template>
  <div class="latelyDialog">
    <n-collapse
      accordion
      :default-expanded-names="['1']"
      @update:expanded-names="updateHandle"
    >
      <template #arrow>
        <div></div>
      </template>
      <n-collapse-item style="color: #333" title="最近对话" name="1">
        <template #header-extra>
          <div>
            <n-icon color="#333">
              <CaretDownOutline v-if="isExpanded" />
              <CaretForward v-else />
            </n-icon>
          </div>
        </template>
        <div class="dialogList" v-if="latelyList?.length">
          <div
            :class="{ active: item.id === currentDialog }"
            v-for="(item, index) in latelyList"
            :key="index"
            @click="clickHandle(item.id)"
          >
            <div>
              <n-ellipsis :line-clamp="1">
                {{ item.name }}
              </n-ellipsis>
              <n-dropdown
                trigger="hover"
                :options="options"
                @select="(key) => handleSelect(key, item)"
              >
                <n-icon color="#333" style="margin-top: 4px">
                  <EllipsisHorizontal />
                </n-icon>
              </n-dropdown>
            </div>
          </div>
        </div>
        <n-empty v-else description="暂无对话" style="--n-icon-color: #ccc;--n-text-color:#ccc;"/>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<style lang="less" scoped>
.latelyDialog {
  margin-top: 24px;
}

.dialogList {
  & > div {
    width: 100%;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 20px;
    font-size: 14px;
    & > div {
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
    }
  }
  & > div:hover {
    background-color: #f0f0f0;
  }

  .active {
    color: #333 !important;
    background: #fff !important;
    font-weight: 600;
    box-shadow: 1px 1px 5px #ccc;
  }
}

:deep(
    .n-collapse
      .n-collapse-item
      .n-collapse-item__header
      .n-collapse-item__header-main
  ) {
  color: #333;
}
</style>
