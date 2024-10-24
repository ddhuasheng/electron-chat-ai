export type SpeechEvent = "start" | "pause" | "resume" | "end" | 'error';

export interface SpeechReturnType {
  // pause: () => void;
  // resume: () => void;
  // start: () => void;
  addEventListener: (event: SpeechEvent, callback: () => void) => void;
  clearEventListener: (event: SpeechEvent, callback: () => void) => void;
};
