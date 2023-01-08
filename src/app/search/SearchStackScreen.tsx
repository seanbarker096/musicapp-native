import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import Search from './Search';

const SearchStackNavigator = createNativeStackNavigator();

interface SearchStackScreenProps {}

const SearchStackScreen: FC<SearchStackScreenProps> = () => (
  <SearchStackNavigator.Navigator>
    <SearchStackNavigator.Screen
      component={Search}
      name="Search"
    ></SearchStackNavigator.Screen>
  </SearchStackNavigator.Navigator>
);

export default SearchStackScreen;
