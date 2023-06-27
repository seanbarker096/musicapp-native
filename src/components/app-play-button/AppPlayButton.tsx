import { IconColor, SVGIcon } from 'components/icon';
import { PlayButtonSVG } from 'components/icon/svg-components';
import { Pressable, StyleSheet, View } from 'react-native';
import { COLOR_NEUTRAL_XXXXLIGHT, COLOR_PRIMARY } from 'styles';

type Props = {
  handlePlayPress: () => void;
};

const HEIGHT = 35;
export const AppPlayButton: React.FC<Props> = ({ handlePlayPress }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={handlePlayPress}
      >
        <SVGIcon
          color={IconColor.WHITE}
          height={HEIGHT / 2}
          width={HEIGHT / 2}
          handlePress={handlePlayPress}
          position="relative"
          styles={{ marginRight: -2 }}
        >
          <PlayButtonSVG></PlayButtonSVG>
        </SVGIcon>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  button: {
    height: HEIGHT,
    width: HEIGHT,
    borderRadius: HEIGHT,
    borderWidth: 3,
    borderColor: COLOR_NEUTRAL_XXXXLIGHT,
    backgroundColor: COLOR_PRIMARY,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
