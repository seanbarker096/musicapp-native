import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface IconProps {
  iconName: string;
}

const iconsRoot = 'assets/';

const Icon: FC<IconProps> = ({ iconName }) => {
  console.log(iconName);

  return (
    <View style={styles.iconContainer}>
      <Image
        source={{
          uri: require(`assets/icons/${iconName}.svg`),
          height: 20,
          width: 20,
        }}
      ></Image>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    display: 'flex',
    padding: '2px',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Icon;
