import { request } from "@/services";
import { FileListVO, latelyDialogState } from "@/types";

export const getFileList = () => {
  return request<{ files: FileListVO[] }>({
    url: "/api/v1/file/list",
    method: "get",
  });
};

export const uploadFile = (file: any) => {
  return request<{ fileId: string }>({
    url: "/api/v1/file/upload",
    method: "post",
    data: file,
  });
};

export const deleteFile = (fileId: string) => {
  return request({
    url: `/api/v1/file/delete`,
    method: "post",
    data: {
      fileId,
    },
  });
};

export const FileChat = (
  data: Omit<latelyDialogState, "name"> & { fileId: string }
) => {
  return request({
    url: "/api/v1/file/chat",
    method: "post",
    data,
  });
};
