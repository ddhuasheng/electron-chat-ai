import { RoleEnum } from '@/enums'

export const RoleConst = [
  {
    label: '管理员',
    value: RoleEnum.ROLE_SYSTEM
  },
  {
    label: '普通用户',
    value: RoleEnum.ROLE_USER
  },
  {
    label: '机器人',
    value: RoleEnum.ROLE_ASSISTANT
  }
]