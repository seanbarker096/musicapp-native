import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
  handlePress?: () => void;
}

export const AppText: FC<AppTextProps> = ({
  size = 'regular',
  weight = 'normal',
  textColor = COLOR_XXXXDARK,
  children,
  isLink = false,
  handlePress = () => {},
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
      <Text
        onPress={isLink ? handlePress : () => {}}
        style={{
          ...styles.text,
          color: textColor,
          ...(isLink ? baseStyles.link : {}),
        }}
      >
        {children}
      </Text>
    </View>
  );
};

const baseStyles = StyleSheet.create({
  link: {
    color: COLOR_LINK,
  },
});
