/** Same as MCSV web-user; override with VITE_RECAPTCHA_SITE_KEY */
export const RECAPTCHA_SITE_KEY =
  (import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined) ||
  '6LcuMHgsAAAAABrZKCVh10Pa3FAvubOcndG7M584'
