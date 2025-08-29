import { defineEventHandler, getRouterParam } from 'h3'
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

export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, 'id') || '')
  if (!id) return { points: [], updatedAt: null }
  const store = await readStore()
  return store[id] || { points: [], updatedAt: null }
}) 