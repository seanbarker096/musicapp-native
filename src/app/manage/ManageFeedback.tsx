import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon';
import {
  FacebookSVG,
  InstagramSVG,
  MailSVG,
  TwitterSVG,
} from 'components/icon/svg-components';
import { StyleSheet, View } from 'react-native';
import { APP_GUTTER, SPACING_SMALL, SPACING_XXSMALL } from 'styles';

type Props = {};

export const ManageFeedback: React.FC<Props> = () => {
  return (
    <View style={styles.container}>
      <AppText
        size="xxlarge"
        weight="bold"
        textAlign="center"
        marginBottom={SPACING_XXSMALL}
      >
        Give us your feedback!
      </AppText>
      <AppText marginBottom={SPACING_XXSMALL}>
        Our team are always looking to speak to users in order to improve your
        experience on Gigstory. We'd love to hear from you with any feedback,
        ideas or suggestions you have for the app.
      </AppText>
      <AppText marginBottom={SPACING_SMALL}>
        You can reach out to us on the following platforms:
      </AppText>
      <View style={styles.listItem}>
        <SVGIcon
          width={20}
          height={20}
          styles={{ marginRight: SPACING_XXSMALL }}
        >
          <MailSVG></MailSVG>
        </SVGIcon>
        <AppText size="large">gigstory@gmail.com</AppText>
      </View>
      <View style={styles.listItem}>
        <SVGIcon
          width={20}
          height={20}
          styles={{ marginRight: SPACING_XXSMALL }}
        >
          <InstagramSVG></InstagramSVG>
        </SVGIcon>
        <AppText size="large">gigstoryy</AppText>
      </View>
      <View style={styles.listItem}>
        <SVGIcon
          width={20}
          height={20}
          styles={{ marginRight: SPACING_XXSMALL }}
        >
          <TwitterSVG></TwitterSVG>
        </SVGIcon>
        <AppText size="large">gigstoryy</AppText>
      </View>
      <View style={styles.listItem}>
        <SVGIcon
          width={20}
          height={20}
          styles={{ marginRight: SPACING_XXSMALL }}
        >
          <FacebookSVG></FacebookSVG>
        </SVGIcon>
        <AppText size="large">gigstoryy</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: APP_GUTTER,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING_XXSMALL,
  },
});
