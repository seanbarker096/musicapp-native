import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppShellStackScreenProps } from 'app/app-shell/appShell.types';
import * as ImagePicker from 'expo-image-picker';
import { Performer } from 'store/performers';

export type CreatePostStackParamList = {
  CreatePost: {
    performer: Performer;
  };
  CreatePerformanceStack: undefined;
  CreatePostPerformerSearch: undefined;
};

// TODO: Should probably seperate these screens given completely unrelated navigators

/**
 * Composite type which accounts for the parent navigator, and allows type safe navigation to parent navigator routes.
 */
export type CreatePostStackScreenProps = CompositeScreenProps<
  NativeStackScreenProps<CreatePostStackParamList, 'CreatePost'>,
  AppShellStackScreenProps
>;

export interface PostFile {
  imageInfo: ImagePicker.ImageInfo;
  mimeType: string;
  fileName: string;
  blob: Blob;
}

