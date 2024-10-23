import { RoleEnum } from '@/enums'

const DEFAULT_SYSTEM = '你是kimi。你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。'

export const Message = {
  [RoleEnum.ROLE_SYSTEM]: (content?: string) => {
    return {
      role: RoleEnum.ROLE_SYSTEM,
      content: content || DEFAULT_SYSTEM
    }
  },
  [RoleEnum.ROLE_USER]: (content: string) => {
    return {
      role: RoleEnum.ROLE_USER,
      content
    }
  },
  [RoleEnum.ROLE_ASSISTANT]: (content: string) => {
    return {
      role: RoleEnum.ROLE_ASSISTANT,
      content
    }
  }
}