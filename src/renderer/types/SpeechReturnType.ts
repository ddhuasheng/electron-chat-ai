export type SpeechEvent = "start" | "pause" | "resume" | "end" | 'error';

export interface SpeechReturnType {
  speech: () => void;
  cancel: () => void;
  clearAllEventListener: (event: SpeechEvent) => void;
  addEventListener: (event: SpeechEvent, callback: (e?: any) => void) => void;
  clearEventListener: (event: SpeechEvent, callback: () => void) => void;
};
