let loadingPromise: Promise<void> | null = null

export function loadRecaptcha(): Promise<void> {
  if (loadingPromise) return loadingPromise
  const w = window as unknown as {
    grecaptcha?: { render?: unknown }
    onRecaptchaLoad?: () => void
  }
  if (w.grecaptcha?.render) return Promise.resolve()

  loadingPromise = new Promise<void>((resolve) => {
    w.onRecaptchaLoad = () => resolve()
    const script = document.createElement('script')
    script.src =
      'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  })

  return loadingPromise
}
