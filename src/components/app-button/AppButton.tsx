import { AppText } from 'components/app-text';
import { FC } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { BUTTON_COLOR_PRIMARY, COLOR_NEUTRAL_XXXXLIGHT } from 'styles';

interface AppButtonProps {
  disabled?: boolean;
  color?: string;
  text: string;
  handlePress: () => void;
  marginBottom?: number;
  isSubmitting?: boolean;
}
export const AppButton: FC<AppButtonProps> = ({
  color = BUTTON_COLOR_PRIMARY,
  disabled = false,
  text,
  handlePress,
  marginBottom = 0,
  isSubmitting = false,
}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: color,
        opacity: disabled && !isSubmitting ? 0.5 : 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom,
        position: 'relative',
      }}
      disabled={disabled || isSubmitting}
      onPress={handlePress}
    >
      <AppText
        hidden={isSubmitting}
        textColor={COLOR_NEUTRAL_XXXXLIGHT}
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
