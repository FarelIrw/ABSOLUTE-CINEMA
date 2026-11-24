import * as SecureStore from 'expo-secure-store';

const CHUNK_SIZE_BYTES = 1800;
const META_SUFFIX = '.__chunks_meta';
const CHUNK_SUFFIX = '.__chunk.';

type ChunkMetadata = {
  version: string;
  count: number;
};

function metadataKey(key: string) {
  return `${key}${META_SUFFIX}`;
}

function chunkKey(key: string, version: string, index: number) {
  return `${key}${CHUNK_SUFFIX}${version}.${index}`;
}

function parseMetadata(value: string | null): ChunkMetadata | null {
  if (!value) return null;

  try {
    const metadata: unknown = JSON.parse(value);
    if (
      typeof metadata === 'object' &&
      metadata !== null &&
      'version' in metadata &&
      typeof metadata.version === 'string' &&
      'count' in metadata &&
      typeof metadata.count === 'number' &&
      Number.isInteger(metadata.count) &&
      metadata.count > 0
    ) {
      return { version: metadata.version, count: metadata.count };
    }
  } catch {
    // Invalid metadata is handled as a storage error by the caller.
  }

  throw new Error('SecureStore contains invalid session metadata.');
}

function utf8Length(character: string) {
  const codePoint = character.codePointAt(0) ?? 0;
  if (codePoint <= 0x7f) return 1;
  if (codePoint <= 0x7ff) return 2;
  if (codePoint <= 0xffff) return 3;
  return 4;
}

function splitIntoChunks(value: string) {
  const chunks: string[] = [];
  let currentChunk = '';
  let currentBytes = 0;

  for (const character of value) {
    const characterBytes = utf8Length(character);
    if (currentBytes + characterBytes > CHUNK_SIZE_BYTES && currentChunk) {
      chunks.push(currentChunk);
      currentChunk = '';
      currentBytes = 0;
    }

    currentChunk += character;
    currentBytes += characterBytes;
  }

  if (currentChunk || chunks.length === 0) chunks.push(currentChunk);
  return chunks;
}

async function readMetadata(key: string) {
  return parseMetadata(await SecureStore.getItemAsync(metadataKey(key)));
}

async function deleteChunks(key: string, metadata: ChunkMetadata) {
  await Promise.all(
    Array.from({ length: metadata.count }, (_, index) =>
      SecureStore.deleteItemAsync(chunkKey(key, metadata.version, index)),
    ),
  );
}

/** Supabase storage adapter that keeps each SecureStore value below 2 KB. */
export const secureStoreAdapter = {
  async getItem(key: string): Promise<string | null> {
    const metadata = await readMetadata(key);

    // Read values written by the simple, non-chunked adapter if one existed.
    if (!metadata) return SecureStore.getItemAsync(key);

    const chunks = await Promise.all(
      Array.from({ length: metadata.count }, (_, index) =>
        SecureStore.getItemAsync(chunkKey(key, metadata.version, index)),
      ),
    );

    if (chunks.some((chunk) => chunk === null)) {
      throw new Error('SecureStore session is incomplete.');
    }

    return (chunks as string[]).join('');
  },

  async setItem(key: string, value: string): Promise<void> {
    const previousMetadata = await readMetadata(key);
    const version = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const chunks = splitIntoChunks(value);
    const writtenKeys: string[] = [];

    try {
      for (const [index, chunk] of chunks.entries()) {
        const storageKey = chunkKey(key, version, index);
        await SecureStore.setItemAsync(storageKey, chunk);
        writtenKeys.push(storageKey);
      }

      await SecureStore.setItemAsync(
        metadataKey(key),
        JSON.stringify({ version, count: chunks.length } satisfies ChunkMetadata),
      );
    } catch (error) {
      await Promise.allSettled(writtenKeys.map((storageKey) => SecureStore.deleteItemAsync(storageKey)));
      throw error;
    }

    if (previousMetadata) {
      await Promise.allSettled([deleteChunks(key, previousMetadata)]);
    }
    await Promise.allSettled([SecureStore.deleteItemAsync(key)]);
  },

  async removeItem(key: string): Promise<void> {
    const metadata = await readMetadata(key);
    const removals: Promise<void>[] = [
      SecureStore.deleteItemAsync(key),
      SecureStore.deleteItemAsync(metadataKey(key)),
    ];

    if (metadata) removals.push(deleteChunks(key, metadata));
    await Promise.all(removals);
  },
};
