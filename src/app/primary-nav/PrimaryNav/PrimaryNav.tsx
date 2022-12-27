import Avatar from 'components/avatar/Avatar';
import { AvatarSize } from 'components/avatar/Avatar.types';
import Icon from 'components/icon/Icon';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLOR_PRIMARY, SPACING_SMALL } from 'styles';

interface PrimaryNavProps {}

const PrimaryNav: FC<PrimaryNavProps> = () => {
  return (
    <View style={styles.navContainer}>
      <Icon iconName="home-outline"></Icon>
      <Icon iconName="search"></Icon>
      <Icon iconName="bordered-plus"></Icon>
      <Icon
        iconName="people"
        width={24}
        height={24}
      ></Icon>
      <Icon iconName="home-outline"></Icon>
      <Avatar
        size={AvatarSize.SMALL}
        imageUrl="https://www.w3schools.com/howto/img_avatar.png"
      ></Avatar>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    alignItems: 'center',
    backgroundColor: COLOR_PRIMARY,
    display: 'flex',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING_SMALL,
    width: '100%',
  },
});

export default PrimaryNav;
