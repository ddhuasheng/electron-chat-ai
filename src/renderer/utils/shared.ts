import copy from 'copy-to-clipboard';
import { utilServices } from '@/apis'

export const shared = async (str: string) => {
  const { text } = await utilServices.compress(str)

  copy(`${window.location.origin}?shareRecord=${text}`);
};
