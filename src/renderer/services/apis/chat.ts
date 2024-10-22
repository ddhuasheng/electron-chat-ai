import { request } from "../index";
import { latelyDialogState } from "@/types";

export const ChatServices = {
  chat: (data: latelyDialogState) => {
    return request<{ content: string }>({
      method: "post",
      url: "/api/v1/chat/chat",
      data,
    });
  },
};
