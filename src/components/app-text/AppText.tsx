import { FC } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { COLOR_LINK, COLOR_XXXXDARK } from 'styles';
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
  isLink?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  handlePress?: () => void;
}

export const AppText: FC<AppTextProps> = ({
  size = 'regular',
  weight = 'normal',
  textColor = COLOR_XXXXDARK,
  textAlign = 'left',
  children,
  isLink = false,
  handlePress = undefined,
  ...margins
}) => {
  const styles = StyleSheet.create({
    text: {
      fontSize: textSizeMap[size],
      fontWeight: textWeightMap[weight],
    },
  });

  return (
    <Pressable
      onPress={handlePress}
      style={{ ...margins }}
      disabled={!handlePress}
    >
      <Text
        style={{
          ...styles.text,
          color: textColor,
          textAlign,
          ...(isLink ? baseStyles.link : {}),
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
};

const baseStyles = StyleSheet.create({
  link: {
    color: COLOR_LINK,
  },
});
