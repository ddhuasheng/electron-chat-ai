import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { latelyDialogState, LatelyDialogHistoryState } from "@/types";
import { Message } from "@/utils";
import { RoleEnum } from "@/enums";

export const useLatelyDialogStore = defineStore(
  "latelyDialog",
  () => {
    const latelyList = ref<latelyDialogState[]>([]);

    const currentDialog = ref<number | null>(null);
    const running = ref(false);

    const defineMessage = Message[RoleEnum.ROLE_SYSTEM]();

    const addLatelyList = (
      id: number,
      name: string,
      history: LatelyDialogHistoryState[],
      isFile = false
    ) => {
      latelyList.value.unshift({
        id,
        name,
        history,
        isFile,
      });

      if (latelyList.value.length > 5) {
        latelyList.value.pop();
      }
    };

    const putLatelyList = (
      item: LatelyDialogHistoryState,
      isFile = false,
      id: number = currentDialog.value!
    ) => {
      const latelyDialog = findLatelyDialog(id)

      if (latelyDialog) {
        latelyDialog.history.push({ ...item, isFile }); // 添加到历史记录
      }
    };
    const removeLatelyList = (id: number) => {
      const index = findIndexLatelyDialog(id);
      if (index != -1) {
        latelyList.value.splice(index, 1);
      }
    };

    const popLatelyList = () => {
      const latelyDialog = findLatelyDialog(currentDialog.value!);
      latelyDialog?.history.pop();
    };

    const setCurrentDialog = (id: number | null) => {
      currentDialog.value = id;
    };

    const current = computed(() => {
      if (currentDialog.value === null) {
        return {
          id: Date.now(),
          name: "",
          isFile: false,
          history: [defineMessage],
        };
      }

      return findLatelyDialog(currentDialog.value)!
    });

    const setName = (id: number, name: string) => {
      const index = findIndexLatelyDialog(id);
      if (index != -1) {
        latelyList.value[index].name = name;
      }
    };

    const setRunning = (value: boolean) => {
      running.value = value;
    };

    const findIndexLatelyDialog = (id: number) => {
      return latelyList.value.findIndex((item) => item.id === id);
    };

    const findLatelyDialog = (id: number) => {
      return latelyList.value.find((item) => item.id === id);
    };

    return {
      currentDialog,
      latelyList,
      current,
      running,
      addLatelyList,
      putLatelyList,
      removeLatelyList,
      popLatelyList,
      findIndexLatelyDialog,
      setCurrentDialog,
      findLatelyDialog,
      setName,
      setRunning,
    };
  },
  {
    paths: ["latelyList"],
  }
);
