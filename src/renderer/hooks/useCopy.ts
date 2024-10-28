import copyToClipboard from 'copy-to-clipboard'
import { useDialogUtils } from './useDialogUtils';

export const useCopy = () => {

  const { success } = useDialogUtils();

    const copy = (text: string) => {
      copyToClipboard(text)

      success("复制成功");
    }

    return {
      copy
    }
}

