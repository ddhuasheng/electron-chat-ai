import { request } from "@/services";
import { latelyDialogState } from "@/types";

export const ChatServices = {
  chat: (data: latelyDialogState) => {
    return request<{ content: string }>({
      method: "post",
      url: "/chat/chat",
      data,
    });
  },
};
