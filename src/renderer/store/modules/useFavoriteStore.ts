import { defineStore } from "pinia";
import { ref } from "vue";
import { ComponentTypeEnum } from '@/enums'


export const useFavoriteStore = defineStore(
  "container",
  () => {
    const component = ref<ComponentTypeEnum>(ComponentTypeEnum.CONTAINER)
    const fileIds = ref<string[]>([])
    const fileNames = ref<string[]>([])

    const setComponent = (value: ComponentTypeEnum) => {
      component.value = value;
    }

    const setFileIds = (value: string[]) => {
      fileIds.value = value;
    }

    const setFileNames = (value: string[]) => {
      fileNames.value = value;
    }

    return {
      component,
      fileIds,
      fileNames,
      setComponent,
      setFileIds,
      setFileNames,
    };
  },
  {
    cache: false,
  }
);
