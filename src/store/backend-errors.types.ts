export interface ErrorCodes {
  login: 'USER_NOT_FOUND';
  // all: 'UNKNOWN_ERROR';
}

export interface ApiError<T extends keyof ErrorCodes = any> {
  status: 'error';
  error_code: ErrorCodes[T] | 'UNKNOWN_ERROR';
  detail: string;
}
