import { FC } from 'react';
import { Button, View } from 'react-native';
import { BUTTON_COLOR_PRIMARY } from 'styles';

interface AppButtonProps {
  disabled?: boolean;
  color?: string;
  text: string;
  handlePress: () => void;
  marginBottom?: number;
}
export const AppButton: FC<AppButtonProps> = ({
  color = BUTTON_COLOR_PRIMARY,
  disabled = false,
  text,
  handlePress,
  marginBottom = 0,
}) => {
  return (
    <View
      style={{
        backgroundColor: color,
        opacity: disabled ? 0.5 : 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom,
      }}
    >
      <Button
        disabled={disabled}
        onPress={handlePress}
        title={text}
      ></Button>
    </View>
  );
};
