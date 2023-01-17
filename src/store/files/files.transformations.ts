import { File, FileApi } from './files.types';

export function transformFileApi(file: FileApi): File {
  return {
    id: file.id,
    uuid: file.uuid,
    fileName: file.file_name,
    fileSize: file.file_size,
    url: file.url,
    mimeType: file.mime_type,
  };
}
