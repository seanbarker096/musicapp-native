import { transformFileApi } from 'store/files/files.transformations';
import { User, UserApi } from './users.types';

export const transformUserApi = function (user: UserApi): User {
  return {
    id: user.id,
    username: user.username,
    firstName: user.first_name,
    secondName: user.second_name,
    fullName: user.full_name,
    createTime: user.create_time,
    isDeleted: user.is_deleted,
    email: user.email,
    lastLoginDate: user.last_login_date,
    avatarFileUuid: user.avatar_file_uuid,
    languageId: user.language_id,
    timezoneId: user.timezone_id,
    avatarFile: user.avatar_file
      ? transformFileApi(user.avatar_file)
      : undefined,
  };
};
