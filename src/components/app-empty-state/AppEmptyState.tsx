import { AppText } from 'components/app-text';
import { View } from 'react-native';
import { APP_GUTTER, SPACING_XXXSMALL } from 'styles';

type Props = {
  onActionPress?: () => void;
  primaryMessage: string;
  secondaryMessage?: string;
  actionText?: string;
};

export const AppEmptyState: React.FC<Props> = ({
  onActionPress,
  primaryMessage,
  secondaryMessage,
  actionText,
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
    >
      {primaryMessage}
    </AppText>
    {secondaryMessage && (
      <AppText
        textAlign="center"
        size="small"
      >
        {secondaryMessage}
      </AppText>
    )}
    {onActionPress && (
      <AppText
        isLink={true}
        handlePress={onActionPress}
      >
        {actionText}
      </AppText>
    )}
  </View>
);
