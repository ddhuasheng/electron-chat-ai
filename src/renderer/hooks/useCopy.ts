import copyToClipboard from 'copy-to-clipboard'

export const useCopy = () => {
    const copy = (text: string) => {
      copyToClipboard(text)
    }

    return {
      copy
    }
}

