import { describe, expect, it } from 'vitest'

import { createGoogleAdsenseHeadTags } from '../../../build/google-adsense-html'

describe('createGoogleAdsenseHeadTags', () => {
  it('creates AdSense verification tags for the HTML head when a publisher client is configured', () => {
    const tags = createGoogleAdsenseHeadTags(' ca-pub-5266550643309940 ')

    expect(tags).toEqual([
      {
        tag: 'meta',
        attrs: {
          name: 'google-adsense-account',
          content: 'ca-pub-5266550643309940',
        },
        injectTo: 'head',
      },
      {
        tag: 'script',
        attrs: {
          async: true,
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5266550643309940',
          crossorigin: 'anonymous',
        },
        injectTo: 'head',
      },
    ])
  })

  it('does not inject AdSense tags when the publisher client is empty', () => {
    expect(createGoogleAdsenseHeadTags('')).toEqual([])
    expect(createGoogleAdsenseHeadTags('   ')).toEqual([])
  })

  it('does not duplicate the script when the HTML already contains the AdSense code', () => {
    const tags = createGoogleAdsenseHeadTags(
      'ca-pub-5266550643309940',
      '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5266550643309940" crossorigin="anonymous"></script>',
    )

    expect(tags).toEqual([
      {
        tag: 'meta',
        attrs: {
          name: 'google-adsense-account',
          content: 'ca-pub-5266550643309940',
        },
        injectTo: 'head',
      },
    ])
  })
})
