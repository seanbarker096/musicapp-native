export interface ErrorCodes {
  login: 'USER_NOT_FOUND' | 'UNAUTHORIZED';
  signup: 'USER_ALREADY_EXISTS';
}

export interface ApiError<T extends keyof ErrorCodes = any> {
  status: 'error';
  error_code: ErrorCodes[T] | 'UNKNOWN_ERROR';
  detail: string;
}
