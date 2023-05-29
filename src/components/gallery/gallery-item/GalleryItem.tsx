import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { GALLERY_ITEM_HEIGHT } from '../gallery.types';

import { IconColor, SVGIcon } from 'components/icon';
import { PlayButtonSVG } from 'components/icon/svg-components';
import * as VideoThumbnails from 'expo-video-thumbnails';
import React, { FC, memo, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

interface GalleryItemProps {
  postId: number;
  fileUrl: string;
  galleryItemStyles: { [style: string]: any };
}

/**
 * A gallery item that displays a video.
 *
 * This component is memoized to prevent unnecessary re-renders whenever useQuerys retruning posts and post attachments re-run, or cause re-renders, which can be quite often.
 */
export const GalleryItem: FC<GalleryItemProps> = memo(
  ({ postId, fileUrl, galleryItemStyles }) => {
    const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

    const [thumbnailUri, setThumbnailUri] = useState<string | undefined>(
      undefined,
    );

    // Function to extract the thumbnail from the video
    const extractThumbnail = async () => {
      try {
        const result = await VideoThumbnails.getThumbnailAsync(fileUrl, {
          time: 0,
        });
        setThumbnailUri(result.uri);
      } catch (e) {
        console.warn(e);
      }
    };

    // Call the extractThumbnail function when the component mounts
    useEffect(() => {
      extractThumbnail();
    }, []);

    function handleItemPress() {
      navigation.navigate('ViewPost', { postId });
    }

    // TODO add state for if no file was retried (e.g. just empty tstate message as we can't load post in this case)
    return (
      <Pressable
        style={{ ...galleryItemStyles, height: 100 }}
        onPress={handleItemPress}
      >
        {thumbnailUri ? (
          <Image
            source={{ uri: thumbnailUri, height: 100 }}
            resizeMode="cover"
          />
        ) : (
          <SVGIcon
            height={60}
            width={60}
            styles={styles.playIcon}
            color={IconColor.LIGHT}
          >
            <PlayButtonSVG></PlayButtonSVG>
          </SVGIcon>
        )}
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  container: {},
  video: {
    top: 0,
    left: 0,
    width: '100%',
    height: GALLERY_ITEM_HEIGHT,
  },
  videoOverlay: {
    position: 'relative',
    height: GALLERY_ITEM_HEIGHT,
    width: '100%',
  },
  playIcon: {
    left: '85%',
    top: '85%',
    transform: [{ translateY: -11 }, { translateX: -11 }],
  },
});
