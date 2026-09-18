declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Standard Meta events use fbq('track', name, params); events we define
// ourselves (not in Meta's standard list) use fbq('trackCustom', name, params)
// instead, per Meta's own convention.
export function trackMetaEvent(
  event: string,
  params?: Record<string, unknown>,
  custom = false
) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq(custom ? 'trackCustom' : 'track', event, params);
}
