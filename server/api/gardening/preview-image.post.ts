type PreviewImageRequest = {
  url?: string
}

const metadataPatterns = [
  /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i,
  /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["'][^>]*>/i,
  /<meta[^>]+itemprop=["']image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+itemprop=["']image["'][^>]*>/i
]

const assertPageUrl = (value: string | undefined) => {
  if (!value) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A source page URL is required.'
    })
  }

  try {
    const pageUrl = new URL(value)

    if (!['http:', 'https:'].includes(pageUrl.protocol)) {
      throw new Error('Unsupported protocol')
    }

    return pageUrl
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Source page URL must be a valid http or https URL.'
    })
  }
}

const decodeHtmlEntities = (value: string) => value
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, '\'')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')

const findPreviewImage = (html: string) => {
  for (const pattern of metadataPatterns) {
    const match = html.match(pattern)

    if (match?.[1]) {
      return decodeHtmlEntities(match[1].trim())
    }
  }

  return null
}

export default defineEventHandler(async (event) => {
  const body = await readBody<PreviewImageRequest>(event)
  const pageUrl = assertPageUrl(body.url)
  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), 10000)

  try {
    const response = await fetch(pageUrl, {
      signal: abortController.signal,
      headers: {
        'User-Agent': 'Home OS preview image fetcher'
      }
    })

    if (!response.ok) {
      throw createError({
        statusCode: 502,
        statusMessage: `Could not fetch source page (${response.status}).`
      })
    }

    const html = await response.text()
    const previewImage = findPreviewImage(html)

    if (!previewImage) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No social preview image was found on that page.'
      })
    }

    return {
      sourcePageUrl: pageUrl.toString(),
      sourceImageUrl: new URL(previewImage, pageUrl).toString()
    }
  } finally {
    clearTimeout(timeout)
  }
})
