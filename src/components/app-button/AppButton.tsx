import { AppText } from 'components/app-text';
import { FC } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import {
  BUTTON_COLOR_DISABLED,
  BUTTON_COLOR_PRIMARY,
  COLOR_NEUTRAL_XXXXLIGHT,
  SPACING_XSMALL,
  SPACING_XXSMALL,
  SPACING_XXXSMALL,
} from 'styles';

interface AppButtonProps {
  disabled?: boolean;
  color?: string;
  text: string;
  handlePress: () => void;
  marginBottom?: number;
  marginRight?: number;
  isSubmitting?: boolean;
  size?: 'mini' | 'small' | 'mid';
}
export const AppButton: FC<AppButtonProps> = ({
  color = BUTTON_COLOR_PRIMARY,
  disabled = false,
  text,
  handlePress,
  marginBottom = 0,
  marginRight = 0,
  isSubmitting = false,
  size = 'mid',
}) => {
  let paddingHorizontal;
  let paddingVertical;

  switch (size) {
    case 'mini':
      paddingHorizontal = SPACING_XXSMALL;
      paddingVertical = SPACING_XXXSMALL;
      break;
    case 'small':
      paddingHorizontal = SPACING_XXSMALL;
      paddingVertical = SPACING_XXSMALL;
      break;
    default: // mid
      paddingHorizontal = SPACING_XSMALL;
      paddingVertical = SPACING_XSMALL;
      break;
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: color,
        opacity: disabled && !isSubmitting ? 0.5 : 1,
        paddingHorizontal,
        paddingVertical,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom,
        marginRight,
        position: 'relative',
      }}
      disabled={disabled || isSubmitting}
      onPress={handlePress}
    >
      <AppText
        hidden={isSubmitting}
        textColor={
          color === BUTTON_COLOR_DISABLED ? 'black' : COLOR_NEUTRAL_XXXXLIGHT
        }
        weight="semi-bold"
      >
        {text}
      </AppText>

      {isSubmitting && (
        <ActivityIndicator
          size="small"
          color="#000000"
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
      )}
    </TouchableOpacity>
  );
};
