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

const store = useLatelyDialogStore();
const { setComponent } = useFavoriteStore()

const { latelyList, currentDialog } = storeToRefs(store);
const isExpanded = ref(true);
const editIndex = ref<number | null>(null);
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

const clickHandle = (index: number) => {
  store.setCurrentDialog(index);
  setComponent(ComponentTypeEnum.CONTAINER)
};

const handleSelect = (key: string, index: number) => {
  switch (key) {
    case "rename":
      editIndex.value = index;
      name.value = latelyList.value[index].name;
      store.setCurrentDialog(index);
      setComponent(ComponentTypeEnum.CONTAINER)
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
            store.setName(index, name.value)
            editIndex.value = null;
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
          } else if(index === currentDialog.value) {
            store.setCurrentDialog(0)
          }
          setComponent(ComponentTypeEnum.CONTAINER)
          store.removeLatelyList(index);
        },
      });
      break;
    case "favorite":
      const id = latelyList.value[index].id;
      db.get(id).then((res) => {
        if (res) {
          warning("该对话已收藏！！！");
          return;
        }

        const data = latelyList.value[index];
        db.add({
          ...data,
          history: JSON.stringify(data.history),
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
            :class="{ active: index === currentDialog }"
            v-for="(item, index) in latelyList"
            :key="index"
            @click="clickHandle(index)"
          >
            <div>
              <n-ellipsis :line-clamp="1">
                {{ item.name }}
              </n-ellipsis>
              <n-dropdown
                trigger="hover"
                :options="options"
                @select="(key) => handleSelect(key, index)"
              >
                <n-icon color="#333" style="margin-top: 4px">
                  <EllipsisHorizontal />
                </n-icon>
              </n-dropdown>
            </div>
          </div>
        </div>
        <n-empty v-else description="暂无对话" style="--n-text-color: #333"/>
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
