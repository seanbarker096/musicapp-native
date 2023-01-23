import { FC } from 'react';
import { StyleSheet, Text } from 'react-native';
import { textSizeMap, textWeightMap } from './AppText.styles';
import { TextSize, TextWeight } from './AppText.types';

interface AppTextProps {
  size?: TextSize;
  weight?: TextWeight;
  children: React.ReactNode;
}

export const AppText: FC<AppTextProps> = ({
  size = 'regular',
  weight = 'normal',
  children,
}) => {
  const styles = StyleSheet.create({
    text: {
      fontSize: textSizeMap[size],
      weight: textWeightMap[weight],
    },
  });

  return <Text style={{ ...styles.text }}>{children}</Text>;
};

export default AppText;
