import type { SpeechEvent } from "@/types";
import { useDialogUtils } from "./index";

const defaultOptions = {
  lang: "zh-CN",
  volume: 1,
  rate: 1.3,
  pitch: 1,
  voice: window.speechSynthesis.getVoices()[0],
}

export const useSpeech = () => {
  const speech = (text: string, options: Partial<typeof defaultOptions> = {}) => {
    const { error } = useDialogUtils();

    if (!window.speechSynthesis) {
      error("当前浏览器不支持语音合成");
      return;
    }

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.lang = options.lang || defaultOptions.lang;
    utterance.volume = options.volume || defaultOptions.volume;
    utterance.rate = options.rate || defaultOptions.rate;
    utterance.pitch = options.rate || defaultOptions.pitch;
    utterance.voice = options.voice || defaultOptions.voice;

    const eventBus: Partial<Record<SpeechEvent, Function[]>> = {};

    utterance.onend = () => {
      if (eventBus["end"]) {
        eventBus["end"].forEach((cb) => cb());
      }
      console.log("speech end");
    };

    utterance.onpause = () => {
      if (eventBus["pause"]) {
        eventBus["pause"].forEach((cb) => cb());
      }
    };

    utterance.onresume = () => {
      if (eventBus["resume"]) {
        eventBus["resume"].forEach((cb) => cb());
      }
    };

    utterance.onstart = () => {
      if (eventBus["start"]) {
        eventBus["start"].forEach((cb) => cb());
      }
      console.log("speech start");
    };

    utterance.onerror = (err) => {
      console.log("speech error", err)

      if (eventBus["error"]) {
        eventBus["error"].forEach((cb) => cb(err));
      }
    };

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

    const clearAllEventListener = (event: SpeechEvent) => {
      eventBus[event] = [];
    };

    const start = () => {
      window.speechSynthesis.speak(utterance);
    };

    const pause = () => {
      window.speechSynthesis.pause();
    };

    const resume = () => {
      window.speechSynthesis.resume();
    };

    const cancel = () => {
      window.speechSynthesis.cancel();
    };

    const speech = () => {
      if (!text) {
        error("请输入要朗读的内容");
        return;
      }
      if (window.speechSynthesis.speaking) {
        error("正在朗读中");
        return;
      }
      if (!window.speechSynthesis.getVoices().length) {
        error("当前浏览器不支持语音合成");
        return
      }
      if (window.speechSynthesis.paused) {
        resume();
      }
      if (window.speechSynthesis.speaking) {
        pause();
      }
      if (!window.speechSynthesis.speaking) {
        utterance.text = text;
        start();
      }

      console.log("speech", window.speechSynthesis);
    };

    return {
      addEventListener,
      clearEventListener,
      clearAllEventListener,
      speech,
      cancel,
    };
  };

  return {
    speech,
  };
};
