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
    readonly compress: (inputText: string) => string
    readonly uncompress: (compressedString: string) => string
    readonly on: (eventName: string, callback: (...args: any[]) => void) => void
  }

  readonly responsiveVoice: {
    readonly speak: (text: string, options: any) => void
  }
}

declare module 'uuid'