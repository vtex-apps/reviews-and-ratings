window.dataLayer = window?.dataLayer || []

export default function push(event: Record<string, unknown>) {
  window.dataLayer.push(event)
}
