import { RoleEnum } from '@/enums'

export interface latelyDialogState {
  id: number;
  name: string;
  isFile?: boolean;
  history: LatelyDialogHistoryState[];
}

export interface LatelyDialogHistoryState {
  role: RoleEnum,
  content: string;
}