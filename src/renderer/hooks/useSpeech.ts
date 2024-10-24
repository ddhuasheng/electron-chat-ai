import type { SpeechEvent } from "@/types";
import { useDialogUtils } from './index'


export const useSpeech = () => {
  const speech = (
    text: string,
    lang: string = "zh-CN",
    voice: string = 'Female'
  ) => {

    const { error } = useDialogUtils()

    if (!window.speechSynthesis) {
      error("当前浏览器不支持语音合成")
      return;
    }

    const eventBus: Partial<Record<SpeechEvent, Function[]>> = {};


    window.responsiveVoice.speak(text, {
      lang,
      voice,
      onstart: () => {
        console.log("语音合成开始");
        eventBus.start?.forEach((cb) => cb());
      },
      onend: () => {
        console.log("语音合成结束");
        eventBus.end?.forEach((cb) => cb());
      }
    })

    const addEventListener = (event: SpeechEvent, callback: () => void) => {
      if (eventBus[event]?.length) {
        eventBus[event].push(callback);
      } else {
        eventBus[event] = [callback];
      }
    };

    const clearEventListener = (event: SpeechEvent, callback: () => void) => {
      if (eventBus[event]?.length) {
        eventBus[event] = eventBus[event].filter((cb) => cb !== callback);
      }
    };

    return {
      addEventListener,
      clearEventListener,
    };
  };

  return {
    speech,
  };
};
