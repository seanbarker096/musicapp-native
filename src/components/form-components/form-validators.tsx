import * as Yup from 'yup';

export const usernameValidator = Yup.string()
  .max(30, 'Must be 30 characters or less')
  .min(2, 'Must be at least 2 characters')
  .matches(
    /^[a-zA-Z0-9._-]+$/,
    'Username can only contain alphanumeric characters, full stops and underscores',
  );

export const passwordValidator = Yup.string()
  .required('Required')
  .min(8, 'Must be at least 8 characters')
  .matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  );

export const emailValidator = Yup.string()
  .required('Required')
  .matches(
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    'Must be a valid email address',
  );
