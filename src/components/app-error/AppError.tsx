import { AppText } from 'components/app-text';
import { StyleSheet, View } from 'react-native';

interface ErrorProps {
  message: string;
  marginBottom?: number;
}

export const AppError: React.FC<ErrorProps> = ({
  message,
  marginBottom = 0,
}) => {
  return (
    <View style={{ ...styles.container, marginBottom }}>
      <AppText
        textColor="#721C24"
        size="regular"
      >
        {message}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F8D7DA',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
});
