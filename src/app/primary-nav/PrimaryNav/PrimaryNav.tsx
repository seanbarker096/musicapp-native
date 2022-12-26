import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { colorPrimary } from '../../../styles';
import Icon from '../../components/Icon/Icon';

interface PrimaryNavProps {}

const PrimaryNav: FC<PrimaryNavProps> = () => {
  return (
    <View style={styles.navContainer}>
      <Icon iconName="home-outline"></Icon>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    display: 'flex',
    backgroundColor: colorPrimary,
  },
});

export default PrimaryNav;
