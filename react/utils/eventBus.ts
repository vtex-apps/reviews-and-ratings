export const eventBus = {
  on(event: any, callback: any) {
    document.addEventListener(event, e => callback(e.detail))
  },
  dispatch(event: any, data: any = null) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }))
  },
  remove(event: any, callback: any = null) {
    document.removeEventListener(event, callback)
  },
}
