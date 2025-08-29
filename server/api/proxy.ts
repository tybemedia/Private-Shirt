import { defineEventHandler, getQuery, setHeader, sendStream, sendError, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event) as { url?: string }
  if (!url) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Missing url' }))
  }

  const res = await fetch(String(url))
  if (!res.ok) {
    throw createError({ statusCode: res.status, statusMessage: res.statusText })
  }

  setHeader(event, 'Access-Control-Allow-Origin', '*')
  const type = res.headers.get('content-type') || 'application/octet-stream'
  setHeader(event, 'Content-Type', type)
  return sendStream(event, res.body as any)
})


