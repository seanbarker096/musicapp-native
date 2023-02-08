import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { textSizeMap, textWeightMap } from './AppText.styles';
import { TextSize, TextWeight } from './AppText.types';

interface AppTextProps {
  size?: TextSize;
  weight?: TextWeight;
  children: React.ReactNode;
  marginLeft?: string | number;
  marginRight?: string | number;
  marginTop?: string | number;
  marginBottom?: string | number;
}

export const AppText: FC<AppTextProps> = ({
  size = 'regular',
  weight = 'normal',
  children,
  ...margins
}) => {
  const styles = StyleSheet.create({
    text: {
      fontSize: textSizeMap[size],
      fontWeight: textWeightMap[weight],
    },
  });

  return (
    <View style={{ ...margins }}>
      <Text style={{ ...styles.text }}>{children}</Text>
    </View>
  );
};

export default AppText;
