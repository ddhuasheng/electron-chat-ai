import { request } from "../index";
import { latelyDialogState } from "@/types";

export const ChatServices = {
  chat: (data: latelyDialogState) => {
    return request<null, { content: string }>({
      method: "post",
      url: "/api/v1/chat/chat",
      data,
    });
  },
};
