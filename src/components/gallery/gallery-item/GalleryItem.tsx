import { IconColor, SVGIcon } from 'components/icon';
import { PlayButtonSVG } from 'components/icon/svg-components';
import React, { FC, memo } from 'react';
import { Image, Pressable, View } from 'react-native';
import { COLOR_NEUTRAL_XXLIGHT } from 'styles';
import { GALLERY_ITEM_HEIGHT } from '../gallery.types';

interface GalleryItemProps {
  postId: number;
  thumbnailUrl?: string;
  galleryItemStyles: { [style: string]: any };
  handleGalleryItemPress(postId: number): void;
}

/**
 * A gallery item that displays a video.
 *
 * This component is memoized to prevent unnecessary re-renders whenever useQuerys retruning posts and post attachments re-run, or cause re-renders, which can be quite often.
 */
export const GalleryItem: FC<GalleryItemProps> = memo(
  ({ postId, thumbnailUrl, galleryItemStyles, handleGalleryItemPress }) => {
    // TODO add state for if no file was retried (e.g. just empty tstate message as we can't load post in this case)
    return (
      <Pressable
        style={{
          ...galleryItemStyles,
          height: GALLERY_ITEM_HEIGHT,
        }}
        onPress={() => handleGalleryItemPress(postId)}
      >
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl, height: GALLERY_ITEM_HEIGHT }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              backgroundColor: COLOR_NEUTRAL_XXLIGHT,
            }}
          >
            <SVGIcon
              height={30}
              width={30}
              color={IconColor.LIGHT}
            >
              <PlayButtonSVG></PlayButtonSVG>
            </SVGIcon>
          </View>
        )}
      </Pressable>
    );
  },
);
