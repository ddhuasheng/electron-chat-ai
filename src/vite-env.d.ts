/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// electron 主题切换方法类型声明
declare interface Window {
  readonly darkMode: {
    readonly toggle: () => void
    readonly system: () => void
  }

  readonly electron: {
    readonly startDrag: (filename: string) => void
  }
}

declare module 'uuid'