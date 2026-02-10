import { getSupabase } from './supabaseClient'

function b64ToBlob(b64: string, contentType = 'image/jpeg'): Blob {
  // Check if the string is a Data URI (e.g., "data:image/png;base64,...")
  if (b64.includes(',')) {
    const parts = b64.split(',');
    // Update content type from the Data URI if present
    const mimeMatch = parts[0].match(/:(.*?);/);
    if (mimeMatch) {
      contentType = mimeMatch[1];
    }
    b64 = parts[1]; // Use the base64 part
  }
  
  const bstr = atob(b64);
  let n = bstr.length;
  const u8 = new Uint8Array(n);
  while (n--) u8[n] = bstr.charCodeAt(n);
  return new Blob([u8], { type: contentType });
}

export async function uploadMedia(input: File | string, pathPrefix: string, bucket = 'media'): Promise<string | null> {
  // 1. If it's already a URL (http/https/blob), return it as is.
  if (typeof input === 'string' && (input.startsWith('http') || input.startsWith('blob:'))) {
      return input;
  }

  const client = getSupabase()
  if (!client) return null

  const file = typeof input === 'string' ? b64ToBlob(input) : input
  const name = `${pathPrefix}/${Date.now()}_${Math.random().toString(36).slice(2)}`
  const { data, error } = await client.storage.from(bucket).upload(name, file, { upsert: false })
  if (error) return null
  const { data: pub } = client.storage.from(bucket).getPublicUrl(data.path)
  return pub.publicUrl
}
