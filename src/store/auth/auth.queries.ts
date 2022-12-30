import { useMutation, useQuery } from 'react-query';
import axios from '../../axios-instance';
import {
  AuthStatus,
  LoginFormState,
  ValidateAuthQueryState,
} from './auth.types';

const validateAuthState = async (
  state: ValidateAuthQueryState,
): Promise<AuthStatus> => {
  const response = await axios.get(
    'http://192.168.1.144:5000/api/auth/0.1/validate',
  );

  return response.data;
};

export const useValidateAuthQuery = (state: ValidateAuthQueryState) => {
  return useQuery(['auth', state], () => validateAuthState(state));
};

const login = async ({ username, password }: LoginFormState): Promise<any> => {
  const response = await axios.post(
    'http://192.168.1.144:5000/api/auth/0.1/login',
    {
      username,
      password,
    },
  );
  return response.data;
};

export const useLoginMutation = () => {
  return useMutation<any, any, LoginFormState>(request => login(request));
};
