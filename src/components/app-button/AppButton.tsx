import { AppText } from 'components/app-text';
import { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { BUTTON_COLOR_PRIMARY, COLOR_NEUTRAL_XXXXLIGHT } from 'styles';

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
    <TouchableOpacity
      style={{
        backgroundColor: color,
        opacity: disabled ? 0.5 : 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom,
      }}
      disabled={disabled}
      onPress={handlePress}
    >
      <AppText
        size="regular"
        textColor={COLOR_NEUTRAL_XXXXLIGHT}
      >
        {text}
      </AppText>
    </TouchableOpacity>
  );
};
