import { QueryKey, useQuery } from 'react-query';
import { getRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { isArray } from 'utils/utils';
import { filesKeys } from './files.query-keys';
import { transformFileApi } from './files.transformations';
import { File, FileApi, FilesStoreSlice } from './files.types';

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
    url: 'fileservice/0.1/files',
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
