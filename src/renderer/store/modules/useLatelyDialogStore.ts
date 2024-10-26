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
      index: number = currentDialog.value!
    ) => {
      const history = latelyList.value[index].history;

      history.push({ ...item, isFile });

      latelyList.value[index] = {
        ...latelyList.value[index],
        history,
      };
    };
    const removeLatelyList = (index: number) => {
      latelyList.value.splice(index, 1);
    };

    const popLatelyList = () => {
      latelyList.value[currentDialog.value!].history.pop()
    }

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

      return latelyList.value[currentDialog.value];
    });

    const setName = (index: number, name: string) => {
      latelyList.value[index].name = name;
    };

    const setRunning = (value: boolean) => {
      running.value = value;
    };

    const findIndexLatelyDialog = (id: number) => {
      return latelyList.value.findIndex((item) => item.id === id);
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
      setName,
      setRunning,
    };
  },
  {
    paths: ["latelyList"],
  }
);
