const normalizeEnvValue = (value) => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

export const resolveGoogleAdConfig = (env = import.meta.env) => {
  const adClient = normalizeEnvValue(env.VITE_GOOGLE_AD_CLIENT)
  const adSlot = normalizeEnvValue(env.VITE_GOOGLE_AD_SLOT)

  return {
    adClient,
    adSlot,
    enableScript: Boolean(adClient),
    enableManualAdUnits: Boolean(adClient && adSlot),
  }
}
