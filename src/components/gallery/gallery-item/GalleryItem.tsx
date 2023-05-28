import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from 'app/profile/profile.types';
import { GALLERY_ITEM_HEIGHT } from '../gallery.types';

import { ResizeMode, Video } from 'expo-av';
import React, { FC, memo, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface GalleryItemProps {
  postId: number;
  fileUrl: string;
  galleryItemStyles: { [style: string]: any };
  hidePlayButton?: boolean;
}

const LOADING_STRING = '... loading ...';
const BUFFERING_STRING = '...buffering...';
const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;

/**
 * A gallery item that displays a video.
 *
 * This component is memoized to prevent unnecessary re-renders whenever useQuerys retruning posts and post attachments re-run, or cause re-renders, which can be quite often.
 */
export const GalleryItem: FC<GalleryItemProps> = memo(
  ({ postId, fileUrl, galleryItemStyles, hidePlayButton = false }) => {
    const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
    const video = React.useRef<Video>(null);

    const [thumbnailUri, setThumbnailUri] = useState(null);

    // Function to extract the thumbnail from the video
    const extractThumbnail = async () => {
      try {
        const { uri } = await video?.current?.getThumbnailAsync();
        setThumbnailUri(uri);
      } catch (error) {
        console.log('Error extracting thumbnail:', error);
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
      <View style={{ ...galleryItemStyles, height: 100 }}>
        <Pressable
          style={styles.videoOverlay}
          onPress={handleItemPress}
        >
          <Video
            ref={video}
            style={styles.video}
            source={{
              uri: fileUrl,
            }}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
            onLoad={extractThumbnail} // Extract thumbnail when the video is loaded
          />
        </Pressable>
      </View>
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
