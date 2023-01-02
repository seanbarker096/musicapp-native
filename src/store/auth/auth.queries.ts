import * as SecureStore from 'expo-secure-store';
import { useMutation } from 'react-query';
import axios from '../../axios-instance';
import { LoginFormState, LoginResultApi } from './auth.types';

// const validateAuthState = async (): Promise<ValidateAuthStateApi> => {
//   console.log('wooo');
//   return Promise.reject('asdfasd');
//   const response = await axios.get('/api/auth/0.1/validate');

//   return response.data;
// };

// const transformAuthStateApi = (data: ValidateAuthStateApi): AuthUser => {
//   return {
//     userId: data.user_id,
//     role: data.role,
//     status: data.auth_status,
//   };
// };

// export const useValidateAuthQuery = (state: any) => {
//   return useQuery<ValidateAuthStateApi, unknown, AuthUser>(
//     ['auth', state],
//     validateAuthState,
//     {
//       select: transformAuthStateApi,
//       cacheTime: 0, // Ensure the tokens are not stored as cache keys
//     },
//   );
// };

const login = async ({
  username,
  password,
}: LoginFormState): Promise<LoginResultApi> => {
  console.log(axios);
  const response = await axios.post(
    'http://192.168.1.217:5000/api/auth/0.1/login',
    {
      username,
      password,
    },
  );
  return response.data;
};

export const onLoginSuccess = async (data: LoginResultApi) => {
  // const { setAuthState } = useContext(AuthStateContext);

  // const newAuthState = loginResultToAuthState(data);

  // setAuthState(newAuthState);

  // update secure store
  await SecureStore.setItemAsync('refresh_token', data.refresh_token);
  await SecureStore.setItemAsync('access_token', data.access_token);

  // invalidate all other queries (not relevant here as using context for auth)
};

export const useLoginMutation = () => {
  return useMutation<LoginResultApi, any, LoginFormState>(request =>
    login(request),
  );
};

const getAuthToken = async (refreshToken: string): Promise<string> => {
  const response = await axios.post(
    'http://192.168.1.217:5000/api/auth/0.1/token',
    { token_type: 'access' },
    {
      headers: { 'Refresh-Token': refreshToken },
    },
  );

  if (!response.data['token']) {
    throw Error('Invalid response from api');
  }

  return response.data['token'];
};

export const useGetAuthTokenMutation = () => {
  return useMutation<any, any, string>(refreshToken =>
    getAuthToken(refreshToken),
  );
};
