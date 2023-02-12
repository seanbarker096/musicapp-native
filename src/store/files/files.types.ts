import { StoreSlice } from 'store/store.types';

export interface FilesStoreSlice extends StoreSlice {
  Name: 'files';
  ObjectType: File;
  Get: {
    RequestParametersType: FilesGetFilter;
    ResultType: FilesGetResult;
    ErrorType: {};
  };
}

export interface File {
  id: number;
  uuid: string;
  fileName: string;
  mimeType: string;
  fileSize?: number;
  url: string;
}

export interface FileApi {
  id: number;
  uuid: string;
  file_name: string;
  mime_type: string;
  file_size?: number;
  // This is optional on backend, but only because there is a
  // gap in time between uploading file meta data and uploading
  // to s3, which returns the file url
  url: string;
}

export interface FilesGetFilter {
  uuids?: readonly string[];
  ids?: readonly number[];
}

export interface FilesGetResult {
  files: readonly FileApi[];
}

export interface FileCreateRequest {
  fileName: string;
  mimeType: string;
  file: Blob;
  uri: string;
}

export interface FileCreateRequestApi {
  uuid: string;
  file_name: string;
  mime_type: string;
  file: Blob;
}

export interface FileCreateResultApi {
  file: FileApi;
}

export interface FileCreateResult {
  file: File;
}
