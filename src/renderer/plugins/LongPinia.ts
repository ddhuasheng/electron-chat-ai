import { type PiniaPluginContext } from "pinia";
import { toRaw } from "vue";

export interface Option {
  key?: string;
  storage?: Storage;
  paths?: string[];
  cache?: boolean;
}

export const LongPinia = (globalOption?: Option) => {
  return (context: PiniaPluginContext & { options: Option }) => {
    const { store, options } = context;

    const realOption = {
      ...globalOption,
      ...options,
      paths: [...(globalOption?.paths || []), ...(options?.paths || [])],
    };

    realOption.cache = realOption.cache !== false;

    const key = realOption.key ? realOption.key : `${store.$id}`;

    const data = getStorage(key, realOption.storage);

    store.$subscribe(
      (_, state) => {
        if (!realOption.cache) return;

        if (realOption.paths?.length) {
          const data: Record<string, any> = {};
          realOption.paths.forEach((path) => {
            data[path] = toRaw(state[path]);
          });
          setStorage(key, data, realOption.storage);
        } else {
          setStorage(key, toRaw(state), realOption.storage);
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );

    return {
      ...store.$store,
      ...data,
    };
  };
};

const getStorage = (key: string, storage: Storage = localStorage) => {
  const data = storage.getItem(key);
  return data ? JSON.parse(data) : {};
};

const setStorage = <T>(
  key: string,
  data: T,
  storage: Storage = localStorage
) => {
  storage.setItem(key, JSON.stringify(data));
};

declare module "pinia" {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    paths?: string[];
    key?: string;
    storage?: Storage;
    cache?: boolean;
  }
}
