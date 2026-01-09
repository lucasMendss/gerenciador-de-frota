import { getCurrentInstance } from 'vue'

export function useCookies() {
  const { appContext } = getCurrentInstance()
  return appContext.config.globalProperties.$cookies
}
