import * as SecureStore from 'expo-secure-store';

import { QueryKey, useMutation, useQuery } from 'react-query';
import { getRequest, postRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { isArray } from 'utils/utils';
import { v4 as uuidv4 } from 'uuid';

import { filesKeys } from './files.query-keys';
import { transformFileApi } from './files.transformations';
import {
  File,
  FileApi,
  FileCreateRequest,
  FileCreateResult,
  FilesStoreSlice,
} from './files.types';

type FileObjectFields = keyof FilesStoreSlice['ObjectType'];

type FilesGetQueryField = Partial<{
  [key in FileObjectFields]:
    | FilesStoreSlice['ObjectType'][key]
    | readonly FilesStoreSlice['ObjectType'][key][];
}>;

const filesGet = async function (
  params: FilesStoreSlice['Get']['RequestParametersType'],
) {
  const response = await getRequest<FilesStoreSlice>({
    url: 'fileservice/0.1/files/',
    params,
  });

  return response.data.files;
};

export function useFilesGetQuery({
  queryParams,
  enabled = true,
}: {
  queryParams: FilesGetQueryField;
  enabled: boolean;
}) {
  const { uuid, id } = queryParams;

  // There might be cases where first request fails meaning undefined variables are passed in
  // Need to be careful to ensure if we are waiting for variables to be defined, they are
  // used in determining value of enabled. Also even if is defined at runtime,
  // at compile time, when using dependant queries, TS won't know at runtime it will be defined
  // so need to  account for this too
  let apiQueryParams:
    | FilesStoreSlice['Get']['RequestParametersType']
    | undefined = undefined;

  let queryKey: QueryKey = filesKeys.null;

  if (uuid || id) {
    apiQueryParams = {};

    // Settting query key like this assumes we only ever use one parameter
    if (uuid) {
      const processedUUID = isArray(uuid) ? uuid : [uuid];

      apiQueryParams['uuids'] = processedUUID;
      queryKey = filesKeys.filesByUUIDs(processedUUID);
    }

    if (id) {
      const processedId = isArray(id) ? id : [id];

      apiQueryParams['ids'] = processedId;
      queryKey = filesKeys.filesByIds(processedId);
    }
  }

  return useQuery<readonly FileApi[], unknown, readonly File[]>(
    queryKey,
    () =>
      apiQueryParams
        ? filesGet(apiQueryParams)
        : failedQuery('Invalid uuids and ids. At least one must be defined'),
    {
      select: files => files.map(file => transformFileApi(file)),
      enabled,
    },
  );
}

/************************ FILE CREATE ***************************/

// TODO: Create request vuilder for post requests which adds headers
const fileCreate = async function ({
  mimeType,
  fileName,
  file,
  uri,
}: FileCreateRequest): Promise<FileCreateResult> {
  const refreshToken = await SecureStore.getItemAsync('refresh_token');
  const accessToken = await SecureStore.getItemAsync('access_token');

  console.log(refreshToken, accessToken);

  const uuid = uuidv4();

  const form = new FormData();

  form.append('file_name', fileName);
  form.append('mime_type', mimeType);
  form.append('file', { uri, name: fileName, type: mimeType });
  form.append('uuid', uuid);

  console.log('file blob', file);
  console.log('form', form);

  const response = await postRequest<FilesStoreSlice>({
    url: 'fileservice/0.1/files/upload_file/',
    body: form,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return { file: transformFileApi(response.data.file) };
};

export const useFileCreateMutation = function () {
  return useMutation<FileCreateResult, any, FileCreateRequest>(
    (fileCreateRequest: FileCreateRequest) => fileCreate(fileCreateRequest),
  );
};
