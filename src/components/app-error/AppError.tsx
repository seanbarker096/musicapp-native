import { StyleSheet, Text, View } from 'react-native';
import { COLOR_LINK } from 'styles';

interface ErrorProps {
  message: string;
  marginBottom?: number;
  onAction?: () => void;
  errorActionText?: string;
}

export const AppError: React.FC<ErrorProps> = ({
  message,
  marginBottom = 0,
  onAction,
  errorActionText,
}) => {
  return (
    <View style={{ ...styles.container, marginBottom }}>
      <Text>
        {message}{' '}
        <Text
          onPress={onAction}
          style={{ color: COLOR_LINK }}
        >
          Upload another video
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F8D7DA',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
});
