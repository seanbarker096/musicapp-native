import { useQuery } from 'react-query';
import { getRequest } from 'store/request-builder';
import { transformUserApi } from './user.transformations';
import { usersKeys } from './users.query-keys';
import { User, UserApi, UsersStoreSlice } from './users.types';

type UserObjectFields = keyof UsersStoreSlice['ObjectType'];

/**
 * Query fields correspond to the field of the StoreSlice Object. The corresponding value can be a * single value or an array of values.
 */
type UsersGetQueryField = Partial<{
  [key in UserObjectFields]:
    | UsersStoreSlice['ObjectType'][key]
    | readonly UsersStoreSlice['ObjectType'][key][];
}>;

type UserGetQueryField = Partial<{
  [key in UserObjectFields]: UsersStoreSlice['ObjectType'][key];
}>;

const usersGet = async (
  params: UsersStoreSlice['Get']['RequestParametersType'],
) => {
  const response = await getRequest<UsersStoreSlice>({
    url: `users/0.1/users`,
    params,
  });

  return response.data.users;
};

// TODO: Add to docs
// -  warpper around react query for building the axios param object. Converts fields on object into snake case for api
// - defines the transformation function
export const useUserGetQuery = ({ id }: UserGetQueryField) => {
  if (!id) {
    throw Error('Id must be defined to get user');
  }

  const apiQueryParams = {
    user_ids: [id],
  };

  return useQuery<readonly UserApi[], unknown, readonly User[]>(
    usersKeys.userById(id),
    () => usersGet(apiQueryParams),
    {
      select: users => users.map(user => transformUserApi(user)),
    },
  );
};
