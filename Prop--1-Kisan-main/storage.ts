import { getSupabase } from './supabaseClient'

function b64ToBlob(b64: string, contentType = 'image/jpeg'): Blob {
  const arr = b64.split(',')
  const bstr = atob(arr[arr.length - 1])
  let n = bstr.length
  const u8 = new Uint8Array(n)
  while (n--) u8[n] = bstr.charCodeAt(n)
  return new Blob([u8], { type: contentType })
}

export async function uploadMedia(input: File | string, pathPrefix: string, bucket = 'media'): Promise<string | null> {
  const client = getSupabase()
  if (!client) return null
  const file = typeof input === 'string' ? b64ToBlob(input) : input
  const name = `${pathPrefix}/${Date.now()}_${Math.random().toString(36).slice(2)}`
  const { data, error } = await client.storage.from(bucket).upload(name, file, { upsert: false })
  if (error) return null
  const { data: pub } = client.storage.from(bucket).getPublicUrl(data.path)
  return pub.publicUrl
}
