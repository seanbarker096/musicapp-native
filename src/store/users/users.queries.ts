import { useQuery } from 'react-query';
import { getRequest } from 'store/requestBuilder';
import { isArray } from 'utils/utils';
import { transformUserApi } from './user.transformations';
import { User, UserApi, UsersStoreSlice } from './users.types';

interface UsersGetQueryFields {
  ids?: readonly number[];
}

type UserObjectFields = keyof UsersStoreSlice['ObjectType'];

/**
 * Query fields correspond to the field of the StoreSlice Object. The corresponding value can be a * single value or an array of values.
 */
type UsersGetQueryField = {
  [key in UserObjectFields]:
    | UsersStoreSlice['ObjectType'][key]
    | readonly UsersStoreSlice['ObjectType'][key][];
};

const usersGet = async (
  params: UsersStoreSlice['Get']['RequestParametersType'],
) => {
  const response = await getRequest<UsersStoreSlice>({
    url: `users/0.1/users/`,
    params,
  });

  return response.data.users;
};

/**
 * Paramters can be any fields on the Store Slice object. They can be a single value e.g. an id, or an array of ids, meaning we need to check this and place the id inside an arrya if it isn't already in one.
 *
 * @param value
 *
 * @param parameterName
 */
function createArrayQueryParam<T, K extends keyof T>(
  valOrArrayOfVals: T[K] | readonly T[K][],
): readonly T[K][] {
  return isArray(valOrArrayOfVals) ? valOrArrayOfVals : [valOrArrayOfVals];
}

const useUserGetQuery = ({ id }: UsersGetQueryField) => {
  const idArray = createArrayQueryParam<UsersStoreSlice['ObjectType'], 'id'>(
    id,
  );

  const apiQueryParams = {
    user_ids: idArray,
  };

  return useQuery<readonly UserApi[], unknown, readonly User[]>(
    ['users', ...idArray],
    () => usersGet(apiQueryParams),
    {
      select: users => users.map(user => transformUserApi(user)),
    },
  );
};
