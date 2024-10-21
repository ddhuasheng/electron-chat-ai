import { RoleEnum } from '@/enums'

export interface latelyDialogState {
  id: number;
  name: string;
  history: LatelyDialogHistoryState[];
}

export interface LatelyDialogHistoryState {
  role: RoleEnum,
  content: string;
}