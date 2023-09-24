import { ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { SVGIcon } from 'components/icon';
import { LeftArrowSVG } from 'components/icon/svg-components';
import { Platform, View } from 'react-native';
import { File } from 'store/files/files.types';
import { Post } from 'store/posts';

export function isArray(arg: any): arg is readonly any[] {
  return Array.isArray(arg);
}

export function toNumber(value: string | number): number;
export function toNumber(
  value: string | number | null | undefined,
): number | undefined;
export function toNumber(
  value: string | number | null | undefined,
): number | undefined {
  return typeof value === 'number' || value ? Number(value) : undefined;
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isPostWithFile(
  post: (Post & { file: File }) | Post,
): post is Post & { file: File } {
  return (
    !!post.attachments && !!post.attachments[0] && !!post.attachments[0].file
  );
}

/**
 * Create a UTC date from a date, ignoring any time information.
 */
export function createUTCDate(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * On IOS, there is an issue with the back button not appearing inside nested navigators. https://github.com/software-mansion/react-native-screens/issues/1460.
 *
 * This helper method should be used to define the screenOptions in the navigator props, or the options value in the screen props, in order to ensure the back button appears on android and IOS
 */
export function navHeaderFactory({
  screenOptions = {},
  hideBackForEntryScreen = false,
}: {
  screenOptions?: NativeStackNavigationOptions;
  hideBackForEntryScreen?: boolean;
} = {}) {
  return ({
    navigation,
  }: {
    navigation: NativeStackNavigationProp<ParamListBase>;
  }) => {
    const state = navigation.getState();

    return {
      ...screenOptions,
      headerLeft: () =>
        !navigation.canGoBack() ||
        // If we are the first navigator inside the tab navigator, and the entry screen, we don't want to show the back button. You navigate back via the tabs. We pass hideBackForEntryScreen = true in this case.
        (hideBackForEntryScreen && state.routes.length === 1) ? (
          <></>
        ) : (
          <View style={{ marginRight: 10 }}>
            <SVGIcon handlePress={navigation.goBack}>
              <LeftArrowSVG></LeftArrowSVG>
            </SVGIcon>
          </View>
        ),
    };
  };
}

/**
 * Android appears to add some small padding by default, even when padding is set to 0 in react native components. This helper method adds some padding on IOS to ensure consistent spacings on all platforms.
 */
export function addNativePadding() {
  return Platform.OS === 'ios' ? 4 : 0;
}