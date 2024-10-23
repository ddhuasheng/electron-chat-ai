import { request } from "@/services";
import { FileListVO, latelyDialogState } from "@/types";

export const FileChatServices = {
  getFileList: () => {
    return request<{ files: FileListVO[] }>({
      url: "/api/v1/file/list",
      method: "get",
    })
  },
  uploadFile: (file: any) => {
    return request<{ fileId: string }>({
      url: "/api/v1/file/upload",
      method: "post",
      data: file,
    });
  },
  deleteFile: (fileId: string) => {
    return request({
      url: `/api/v1/file/delete`,
      method: "post",
      data: {
        fileId,
      },
    });
  },
  FileChat: (
    data: Omit<latelyDialogState, "name"> & { fileId: string }
  ) => {
    return request<{
      fileContent: string;
      content: string;
    }>({
      url: "/api/v1/file/chat",
      method: "post",
      data,
    });
  }
}