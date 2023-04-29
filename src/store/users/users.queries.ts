import { QueryKey, useQuery } from 'react-query';
import { getRequest } from 'store/request-builder';
import { failedQuery } from 'store/store-utils';
import { isArray } from 'utils/utils';
import { transformUserApi } from './user.transformations';
import { usersKeys } from './users.query-keys';
import { User, UsersStoreSlice } from './users.types';

type UserObjectFields = keyof UsersStoreSlice['ObjectType'];

/**
 * Query fields correspond to the field of the StoreSlice Object. The corresponding value can be a * single value or an array of values.
 */
type UsersGetQueryField = Partial<{
  [key in UserObjectFields]:
    | UsersStoreSlice['ObjectType'][key]
    | readonly UsersStoreSlice['ObjectType'][key][];
}>;

const usersGet = async (
  params: UsersStoreSlice['Get']['RequestParametersType'],
) => {
  const response = await getRequest<UsersStoreSlice>({
    url: `users/0.1/users`,
    params,
  });

  return response.data.users.map(transformUserApi);
};

// TODO: Add to docs
// -  warpper around react query for building the axios param object. Converts fields on object into snake case for api
// - defines the transformation function
export const useUserGetQuery = ({
  queryParams: { id },
  enabled = true,
}: {
  queryParams: UsersGetQueryField;
  enabled?: boolean;
}) => {
  let apiQueryParams:
    | UsersStoreSlice['Get']['RequestParametersType']
    | undefined = undefined;

  let queryKey: QueryKey = usersKeys.null;

  if (id) {
    const processdUserId = isArray(id) ? id : [id];
    apiQueryParams = {
      user_ids: processdUserId,
    };
    queryKey = usersKeys.usersById(processdUserId);
  }

  return useQuery<readonly User[], unknown, readonly User[]>(
    queryKey,
    () =>
      apiQueryParams
        ? usersGet(apiQueryParams)
        : failedQuery(
            `Invalid Featured Posts get query params or unsupported query. Query: ${JSON.stringify(
              apiQueryParams,
            )}`,
          ),
    {
      enabled,
    },
  );
};


// ------------------------------ Users Search ------------------------------ //

const usersSearch = async (
  params: UsersStoreSlice['Search']['RequestBodyType'],
) => {
  const response = await getRequest<UsersStoreSlice>({
    url: `users/0.1/search`,
    params,
  });

  return response.data.users.map(transformUserApi);
};

export function userUsersSearchQuery({
  queryParams: { searchQuery },
  enabled = true,
}: {
  queryParams: { searchQuery?: string };
  enabled?: boolean;
}) {
  let apiQueryParams:
    | UsersStoreSlice['Search']['RequestBodyType']
    | undefined = undefined;

  let queryKey: QueryKey = usersKeys.null;

  if (searchQuery) {
    apiQueryParams = { search_query: searchQuery };
    queryKey = usersKeys.usersBySearchQuery(searchQuery);
  }

  return useQuery<readonly User[], unknown, readonly User[]>(queryKey, () =>
    apiQueryParams
      ? usersSearch(apiQueryParams)
      : failedQuery(
          'Invalid search query. Search query must be defined to search performers',
        ),
        {
          enabled
        }
  );
}
