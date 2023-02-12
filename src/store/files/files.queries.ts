import { AxiosResponse } from 'axios';
import { QueryKey, useMutation, useQuery } from 'react-query';
import { getRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { isArray } from 'utils/utils';
import { v4 as uuidv4 } from 'uuid';
import axios from '../../axios-instance';
import { filesKeys } from './files.query-keys';
import { transformFileApi } from './files.transformations';
import {
  File,
  FileApi,
  FileCreateRequest,
  FileCreateRequestApi,
  FileCreateResult,
  FileCreateResultApi,
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

const fileCreate = async function ({
  mimeType,
  fileName,
}: FileCreateRequest): Promise<FileCreateResult> {
  const uuid = uuidv4();

  const response = await axios.post<
    FileCreateResultApi,
    AxiosResponse<FileCreateResultApi>,
    FileCreateRequestApi
  >('http://192.168.1.217:5000/api/posts/0.1/posts/', {
    uuid,
    mime_type: mimeType,
    file_name: fileName,
  });

  return { file: transformFileApi(response.data.file) };
};

export const useFileCreateMutation = function () {
  return useMutation<FileCreateResult, any, FileCreateRequest>(
    (fileCreateRequest: FileCreateRequest) => fileCreate(fileCreateRequest),
  );
};
