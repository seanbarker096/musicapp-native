export type SignUpStackParamList = {
  SignUpForm: undefined;
  ConfirmSignUp: {
    email: string;
    password: string;
    username: string;
  };
  UploadProfileImage: {
    userId: number;
  };
  CreateBio: {
    userId: number;
  };
};
