const normalizeGoogleAdClient = (value) => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

export const createGoogleAdsenseHeadTags = (adClient, html = '') => {
  const normalizedAdClient = normalizeGoogleAdClient(adClient)
  if (!normalizedAdClient) return []

  const adsenseScriptUrl = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${normalizedAdClient}`
  const tags = []

  if (!html.includes('name="google-adsense-account"')) {
    tags.push({
      tag: 'meta',
      attrs: {
        name: 'google-adsense-account',
        content: normalizedAdClient,
      },
      injectTo: 'head',
    })
  }

  if (!html.includes(adsenseScriptUrl)) {
    tags.push({
      tag: 'script',
      attrs: {
        async: true,
        src: adsenseScriptUrl,
        crossorigin: 'anonymous',
      },
      injectTo: 'head',
    })
  }

  return tags
}

export const googleAdsenseHeadPlugin = (adClient) => ({
  name: 'google-adsense-head-tags',
  transformIndexHtml(html) {
    return createGoogleAdsenseHeadTags(adClient, html)
  },
})
