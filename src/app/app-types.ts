export enum LoggedOutPage {
  LOGIN = 'LOGIN',
  SIGN_UP = 'SIGN_UP',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
}
// This is in here instead of App.tsx to avoid a circular dependency
export type SetLoggedOutPage = React.Dispatch<
  React.SetStateAction<LoggedOutPage | undefined>
>;
