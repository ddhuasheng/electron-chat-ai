import { request } from "@/services";

export const utilServices = {
  compress: (text: string) => {
    return request<{ text: string }>({
      url: "/utils/compress",
      method: "post",
      data: {
        text
      }
    });
  },
  decompress: (text: string) => {
    return request<{ text: string }>({
      url: "/utils/decompress",
      method: "post",
      data: {
        text
      }
    });
  }
}

