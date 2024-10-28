import { request } from "@/services";
import { FileListVO, latelyDialogState } from "@/types";

export const FileChatServices = {
  getFileList: () => {
    return request<{ files: FileListVO[] }>({
      url: "/file/list",
      method: "get",
    })
  },
  uploadFile: (file: any) => {
    return request<{ fileId: string }>({
      url: "/file/upload",
      method: "post",
      data: file,
    });
  },
  deleteFile: (fileId: string) => {
    return request({
      url: `/file/delete`,
      method: "post",
      data: {
        fileId,
      },
    });
  },
  FileChat: (
    data: Omit<latelyDialogState, "name"> & { fileIds: string[] }
  ) => {
    return request<{
      fileContents: string[];
      content: string;
    }>({
      url: "/file/chat",
      method: "post",
      data,
    });
  }
}