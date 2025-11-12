/**
 * 全局类型声明
 */

declare global {
  interface Window {
    __VITE_HTML_CATALOG__: string[]
    __PAGE_TREE__: Record<string, Record<string, string[]>>
    __PAGE_LIST__: Array<{
      path: string
      category: string
      name: string
      file: string
      url: string
    }>
    __CONFIG__: {
      projectRoot: string
      pageDir: string
      hasVue: boolean
      hasVite: boolean
      vueVersion: string
      viteVersion: string
    }
  }
}

export {}

