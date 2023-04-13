import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR_XXXXDARK } from 'styles';
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
  textColor?: string;
}

export const AppText: FC<AppTextProps> = ({
  size = 'regular',
  weight = 'normal',
  textColor = COLOR_XXXXDARK,
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
      <Text style={{ ...styles.text, color: textColor }}>{children}</Text>
    </View>
  );
};
