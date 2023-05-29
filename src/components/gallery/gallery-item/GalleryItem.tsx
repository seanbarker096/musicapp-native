import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { GALLERY_ITEM_HEIGHT } from '../gallery.types';

import { IconColor, SVGIcon } from 'components/icon';
import { PlayButtonSVG } from 'components/icon/svg-components';
import * as VideoThumbnails from 'expo-video-thumbnails';
import React, { FC, memo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

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

    const [loading, setLoading] = useState(false);

    // Function to extract the thumbnail from the video
    const extractThumbnail = async () => {
      try {
        setLoading(true);
        const result = await VideoThumbnails.getThumbnailAsync(fileUrl, {
          time: 0,
        });
        setThumbnailUri(result.uri);
      } catch (e) {
        console.warn(e);
      }
      setLoading(false);
    };

    useEffect(() => {
      extractThumbnail();
    }, [fileUrl]);

    function handleItemPress() {
      navigation.navigate('ViewPost', { postId });
    }

    const thumnailLoading = () => (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <ActivityIndicator
          size="small"
          color="#000000"
        />
      </View>
    );

    // TODO add state for if no file was retried (e.g. just empty tstate message as we can't load post in this case)
    return (
      <Pressable
        style={{ ...galleryItemStyles, height: 100 }}
        onPress={handleItemPress}
      >
        {loading ? (
          thumnailLoading()
        ) : thumbnailUri ? (
          <Image
            source={{ uri: thumbnailUri, height: 100 }}
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
});
