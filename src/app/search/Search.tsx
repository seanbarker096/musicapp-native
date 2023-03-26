import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PerformerSearch } from 'components/performer-search';
import { ProfileType } from 'contexts/profile.context';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Performer } from 'store/performers';
import { InternalSearchStackScreenParamList } from './search-types';

type SearchProps = NativeStackScreenProps<
  InternalSearchStackScreenParamList,
  'search'
>;

// TODO: Add loading state for when an performer is selected and we nav to their performer profile
const Search: FC<SearchProps> = ({ navigation }) => {
  const onPerformerSearchGetOrCreateSuccess = (performer: Performer) =>
    navigation.navigate('profileInternalStackScreen', {
      profileType: ProfileType.PERFORMER,
      profileId: performer.id,
    });

  return (
    <View style={styles.container}>
      <PerformerSearch
        onPerformerSelect={onPerformerSearchGetOrCreateSuccess}
      ></PerformerSearch>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10,
    width: '100%',
  },
  text: {
    height: 40,
    borderWidth: 1,
    width: '100%',
  },
});

export default Search;
