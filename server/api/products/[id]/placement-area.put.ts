import { defineEventHandler, readBody, getRouterParam } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'server', 'data')
const DATA_FILE = path.join(DATA_DIR, 'placement-areas.json')

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({}), 'utf8')
  }
}

async function readStore(): Promise<Record<string, any>> {
  await ensureDataFile()
  const raw = await fs.readFile(DATA_FILE, 'utf8')
  try {
    return JSON.parse(raw || '{}')
  } catch {
    return {}
  }
}

async function writeStore(store: Record<string, any>) {
  await ensureDataFile()
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf8')
}

export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, 'id') || '')
  if (!id) {
    event.node.res.statusCode = 400
    return { error: 'Missing product id' }
  }
  const body = await readBody(event)
  if (!body || !Array.isArray(body.points)) {
    event.node.res.statusCode = 400
    return { error: 'Invalid payload: { points: Array<{x:number,y:number}>' }
  }
  const store = await readStore()
  store[id] = {
    points: body.points,
    updatedAt: body.updatedAt || new Date().toISOString()
  }
  await writeStore(store)
  return { ok: true }
}) 