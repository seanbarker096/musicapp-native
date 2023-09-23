import { File } from 'store/files/files.types';
import { Post } from 'store/posts';
import { SVGIcon } from 'components/icon';
import { LeftArrowSVG } from 'components/icon/svg-components';
import { NavigationHelpers, ParamListBase } from '@react-navigation/native';

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

export function navigationHeaderFactory(screenOptions: {} = {}){
 return ({navigation}: {navigation: NavigationHelpers<ParamListBase>}) => ({
  ...screenOptions,
   headerBackTitleVisible: false, // for ios to prevent showing name of previous page
   headerLeft: () => navigation.canGoBack() ? <SVGIcon handlePress={navigation.goBack}><LeftArrowSVG></LeftArrowSVG></SVGIcon>: <></>})
}