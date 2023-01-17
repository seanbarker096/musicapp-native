import { useQuery } from 'react-query';
import { getRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { filesKeys } from './files.query-keys';
import { transformFileApi } from './files.transformations';
import { File, FileApi, FilesStoreSlice } from './files.types';

type FileObjectFields = keyof FilesStoreSlice['ObjectType'];

type FilesGetQueryField = Partial<{
  [key in FileObjectFields]:
    | FilesStoreSlice['ObjectType'][key]
    | readonly FilesStoreSlice['ObjectType'][key][];
}>;

type FileGetQueryField = Partial<{
  [key in FileObjectFields]: FilesStoreSlice['ObjectType'][key];
}>;

const filesGet = async function (
  params: FilesStoreSlice['Get']['RequestParametersType'],
) {
  const response = await getRequest<FilesStoreSlice>({
    url: 'files/0.1/files',
    params,
  });

  return response.data.files;
};

export function useFileGetQuery({
  queryParams,
  enabled = true,
}: {
  queryParams: FileGetQueryField;
  enabled: boolean;
}) {
  const { uuid } = queryParams;

  // There might be cases where first request fails meaning undefined variables are passed in
  // Need to be careful to ensure if we are waiting for variables to be defined, they are
  // used in determining value of enabled. Also even if is defined at runtime,
  // at compile time, when using dependant queries, TS won't know at runtime it will be defined
  // so need to  account for this too
  const apiQueryParams = uuid
    ? {
        uuids: [uuid],
      }
    : undefined;

  return useQuery<readonly FileApi[], unknown, readonly File[]>(
    filesKeys.fileByUUID(uuid),
    () =>
      apiQueryParams
        ? filesGet(apiQueryParams)
        : failedQuery('Invalid uuids. It is likely that uuid was undefined'),
    {
      select: files => files.map(file => transformFileApi(file)),
      enabled,
    },
  );
}
