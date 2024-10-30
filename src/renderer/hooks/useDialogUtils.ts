import { useMessage, useDialog, type DialogOptions } from "naive-ui";

export const useDialogUtils = () => {
  const message = useMessage();
  const dialog = useDialog();

  const success = (msg: string) => {
    message.success(msg);
  };

  const error = (msg: string) => {
    message.error(msg);
  };

  const warning = (msg: string) => {
    message.warning(msg);
  };

  const info = (msg: string) => {
    message.info(msg);
  };

  const confirm = (options: DialogOptions) => {
    const type =
      !options.type || options.type === "default" ? "info" : options.type;

    return dialog[type]({
      title: options.title || "提示",
      content: options.content,
      positiveText: options.positiveText || "确定",
      negativeText: options.negativeText || "取消",
      onPositiveClick: options.onPositiveClick,
      onNegativeClick: options.onNegativeClick,
    });
  };

  return {
    success,
    error,
    warning,
    info,
    confirm,
  };
};
