import { defineStore } from "pinia";
import { ref } from "vue";
import { ComponentTypeEnum } from '@/enums'


export const useFavoriteStore = defineStore(
  "container",
  () => {
    const component = ref<ComponentTypeEnum>(ComponentTypeEnum.CONTAINER)

    const setComponent = (value: ComponentTypeEnum) => {
      component.value = value;
    }

    return {
      component,
      setComponent,
    };
  },
  {
    cache: false,
  }
);
