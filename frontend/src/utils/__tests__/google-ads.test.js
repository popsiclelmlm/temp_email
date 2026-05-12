import { describe, expect, it } from 'vitest'

import { resolveGoogleAdConfig } from '../google-ads'

describe('resolveGoogleAdConfig', () => {
  it('loads the AdSense script when only the publisher client is configured', () => {
    const config = resolveGoogleAdConfig({
      VITE_GOOGLE_AD_CLIENT: 'ca-pub-5266550643309940',
    })

    expect(config.adClient).toBe('ca-pub-5266550643309940')
    expect(config.adSlot).toBe('')
    expect(config.enableScript).toBe(true)
    expect(config.enableManualAdUnits).toBe(false)
  })

  it('enables manual ad units only when both publisher client and slot are configured', () => {
    const config = resolveGoogleAdConfig({
      VITE_GOOGLE_AD_CLIENT: 'ca-pub-5266550643309940',
      VITE_GOOGLE_AD_SLOT: '1234567890',
    })

    expect(config.enableScript).toBe(true)
    expect(config.enableManualAdUnits).toBe(true)
  })

  it('treats empty publisher client values as disabled', () => {
    const config = resolveGoogleAdConfig({
      VITE_GOOGLE_AD_CLIENT: '  ',
      VITE_GOOGLE_AD_SLOT: '1234567890',
    })

    expect(config.adClient).toBe('')
    expect(config.enableScript).toBe(false)
    expect(config.enableManualAdUnits).toBe(false)
  })
})
