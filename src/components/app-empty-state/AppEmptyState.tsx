import { AppText, TextSize } from 'components/app-text';
import { View } from 'react-native';
import { APP_GUTTER, SPACING_XXSMALL, SPACING_XXXSMALL } from 'styles';

type Props = {
  onActionPress?: () => void;
  primaryMessage: string;
  secondaryMessage?: string;
  actionText?: string;
  headingSize?: TextSize;
  bodyTextSize?: TextSize;
};

export const AppEmptyState: React.FC<Props> = ({
  onActionPress,
  primaryMessage,
  secondaryMessage,
  actionText,
  headingSize = 'regular',
  bodyTextSize = 'small',
}) => (
  <View
    style={{
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: APP_GUTTER,
    }}
  >
    <AppText
      weight="bold"
      textAlign="center"
      marginBottom={SPACING_XXXSMALL}
      size={headingSize}
    >
      {primaryMessage}
    </AppText>
    {secondaryMessage && (
      <AppText
        textAlign="center"
        size={bodyTextSize}
      >
        {secondaryMessage}
      </AppText>
    )}
    {onActionPress && (
      <AppText
        marginTop={SPACING_XXSMALL}
        isLink={true}
        handlePress={onActionPress}
      >
        {actionText}
      </AppText>
    )}
  </View>
);
