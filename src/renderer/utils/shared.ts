import copy from 'copy-to-clipboard';
import { utilServices } from '@/apis'

export const shared = async (str: string) => {
  const { text } = await utilServices.compress(str)
  console.log(text)
  copy(`${window.location.origin}?shareRecord=${text}`);
};
