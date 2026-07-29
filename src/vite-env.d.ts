/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_ADSENSE_CLIENT_ID?: string
  readonly VITE_ADSENSE_SLOT_EDITOR?: string
  readonly VITE_ADSENSE_SLOT_REVIEW?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: Blob | BufferSource | string): Promise<void>
  close(): Promise<void>
}

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>
}
