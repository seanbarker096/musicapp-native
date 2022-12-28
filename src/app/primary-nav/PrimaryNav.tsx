import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { NavigationHelpers, ParamListBase } from '@react-navigation/native';
import { Avatar, AvatarSize } from 'components/avatar';
import { IconColor } from 'components/icon/icon.types';
import {
  BorderedPlusSVG,
  HomeOutlineSVG,
  PeopleSVG,
  SearchOutlineSVG,
} from 'components/icon/svg-components';
import SVGIcon from 'components/icon/SVGIcon';
import { FC, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { NAVIGATION_BACKGROUND_COLOR, SPACING_SMALL } from 'styles';
import {
  PrimaryNavNavigatorParamList,
  PrimaryScreens,
} from './PrimaryNav.types';

interface PrimaryNavProps {
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}

const PrimaryNav: FC<PrimaryNavProps> = ({ navigation }) => {
  const [color, setColor] = useState(IconColor.LIGHT);

  const handleNavigation = (screen: keyof PrimaryNavNavigatorParamList) => {
    navigation.navigate(screen);
  };

  return (
    <>
      <Button
        title="sadsad"
        onPress={() =>
          setColor(color === IconColor.DARK ? IconColor.LIGHT : IconColor.DARK)
        }
      ></Button>
      <View style={styles.navContainer}>
        <SVGIcon
          color={color}
          clickable={true}
        >
          <HomeOutlineSVG></HomeOutlineSVG>
        </SVGIcon>
        <SVGIcon clickable={true}>
          <SearchOutlineSVG></SearchOutlineSVG>
        </SVGIcon>
        <SVGIcon clickable={true}>
          <PeopleSVG></PeopleSVG>
        </SVGIcon>
        <SVGIcon clickable={true}>
          <BorderedPlusSVG></BorderedPlusSVG>
        </SVGIcon>
        <Avatar
          size={AvatarSize.SMALL}
          imageUrl="https://www.w3schools.com/howto/img_avatar.png"
          onPress={() => handleNavigation(PrimaryScreens.PROFILE)}
        ></Avatar>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    alignItems: 'center',
    backgroundColor: NAVIGATION_BACKGROUND_COLOR,
    display: 'flex',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING_SMALL,
    width: '100%',
  },
});

export default PrimaryNav;
