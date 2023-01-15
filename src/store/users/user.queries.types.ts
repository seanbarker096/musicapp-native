export interface User {
  id: number;
  username: string;
  firstName: string;
  secondName: string;
  createTime: number;
  isDeleted: boolean;
  email: string;
  lastLoginDate: number;
  avatarFileUuid?: string;
  languageId?: string;
  timezoneId?: string;
}

export interface UserApi {
  id: number;
  username: string;
  first_name: string;
  second_name: string;
  create_time: number;
  is_deleted: boolean;
  email: string;
  last_login_date: number;
  avatar_file_uuid?: string;
  language_id?: string;
  timezone_id?: string;
}
