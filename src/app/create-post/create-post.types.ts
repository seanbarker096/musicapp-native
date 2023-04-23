import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppShellStackScreenProps } from 'app/app-shell/appShell.types';

export type CreatePostStackParamList = {
  CreatePost: undefined;
};

// TODO: Should probably seperate these screens given completely unrelated navigators

/**
 * Composite type which accounts for the parent navigator, and allows type safe navigation to parent navigator routes.
 */
export type CreatePostStackScreenProps = CompositeScreenProps<
  NativeStackScreenProps<CreatePostStackParamList, 'CreatePost'>,
  AppShellStackScreenProps
>;
