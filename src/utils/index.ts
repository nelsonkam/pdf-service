import crypto from 'crypto';

export async function generateChecksum(content: Buffer): Promise<string> {
  const hash = crypto.createHash('sha1');
  hash.update(content);
  return hash.digest('hex');
}
