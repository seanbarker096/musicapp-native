/**
 * Store slice type definitions
 */

import { File, FileApi } from 'store/files/files.types';
import { StoreSlice } from 'store/store.types';

export interface UsersStoreSlice extends StoreSlice {
  Name: 'users';
  ObjectType: User;
  Get: {
    RequestParametersType: UsersGetFilterApi;
    ResultType: UsersGetResultApi;
    ErrorType: {};
  };
  Search: {
    RequestBodyType: UsersSearchRequestApi;
    ResultType: UsersGetResultApi;
    ErrorType: {};
  };
  Patch: {
    RequestBodyType: UserUpdateRequestApi;
    ResultType: UserUpdateResultApi;
    ErrorType: {};
  };
}

/**
 * Other type definitionns
 */
export interface User {
  id: number;
  username: string;
  firstName: string;
  secondName: string;
  fullName: string;
  bio?: string;
  createTime: number;
  isDeleted: boolean;
  email: string;
  lastLoginDate: number;
  avatarFileUuid?: string;
  languageId?: string;
  timezoneId?: string;
  avatarFile?: File;
}

export interface UserApi {
  id: number;
  username: string;
  first_name: string;
  second_name: string;
  full_name: string;
  bio?: string;
  create_time: number;
  is_deleted: boolean;
  email: string;
  last_login_date: number;
  avatar_file_uuid?: string;
  language_id?: string;
  timezone_id?: string;
  avatar_file?: FileApi;
}

export interface UsersGetFilterApi {
  user_ids?: readonly number[];
  include_profile_image?: boolean;
}

export interface UsersGetResultApi {
  users: readonly UserApi[];
}

export interface UsersSearchRequestApi {
  search_query: string;
  include_profile_image?: boolean;
  limit?: number;
}

export interface UserUpdateRequest {
  avatarFileUuid?: string;
  bio?: string;
  firstName?: string;
  secondName?: string;
}

export interface UserUpdateRequestApi {
  avatar_file_uuid?: string;
  bio?: string;
  first_name?: string;
  second_name?: string;
}
export interface UserUpdateResultApi {
  user: UserApi;
}