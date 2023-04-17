import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { Gallery } from 'components/gallery';
import React, { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FONT_WEIGHT_BOLD, SPACING_XXSMALL } from 'styles';
import { ManageStackParamList } from './manage-types';

type ManageFeaturedPostsProps = NativeStackScreenProps<
  ManageStackParamList,
  'ManageFeaturedPosts'
>;

enum SelectedTab {
  USER_FEATURES = 'userFeatures',
  ARTIST_FEATURES = 'artistFeatures',
}

export const ManageFeaturedPosts: FC<ManageFeaturedPostsProps> = ({
  navigation,
}) => {
  const [selectedTab, setSelectedTab] = React.useState<SelectedTab>(
    SelectedTab.ARTIST_FEATURES,
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => setSelectedTab(SelectedTab.USER_FEATURES)}>
          <AppText weight={FONT_WEIGHT_BOLD}>Featured by users</AppText>
        </Pressable>
        <Pressable onPress={() => setSelectedTab(SelectedTab.ARTIST_FEATURES)}>
          <AppText weight={FONT_WEIGHT_BOLD}>Featured by artists</AppText>
        </Pressable>
      </View>
      <Gallery
        postsWithAttachmentsAndFiles={postsWithAttachmentsAndFiles}
        isLoading={postsLoading}
      ></Gallery>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: SPACING_XXSMALL,
    paddingBottom: SPACING_XXSMALL,
    width: '100%',
  },
});
