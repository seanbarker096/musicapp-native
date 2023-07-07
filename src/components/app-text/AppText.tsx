import { FC } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { COLOR_LINK, COLOR_XXXXDARK, SPACING_NONE } from 'styles';
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
  padding?: string | number;
  hidden?: boolean;
  maxLines?: number;
}

export const AppText: FC<AppTextProps> = ({
  size = 'regular',
  weight = 'normal',
  textColor = COLOR_XXXXDARK,
  textAlign = 'left',
  children,
  isLink = false,
  handlePress = undefined,
  padding = SPACING_NONE,
  hidden = false,
  maxLines = undefined,
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
      style={{
        ...margins,
        paddingLeft: padding,
        paddingRight: padding,
      }}
      disabled={!handlePress}
    >
      <Text
        numberOfLines={maxLines} // This is required to make multiline work, but numberOfLines
        style={{
          ...styles.text,
          color: hidden ? 'transparent' : textColor,
          textAlign,
          ...(isLink ? baseStyles.link : {}),
          fontFamily: 'Quicksand',
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
