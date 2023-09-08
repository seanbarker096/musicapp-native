import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon';
import {
  FacebookSVG,
  InstagramSVG,
  MailSVG,
  TwitterSVG,
} from 'components/icon/svg-components';
import { FC } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  SPACING_MID,
  SPACING_SMALL,
  SPACING_XSMALL,
  SPACING_XXSMALL,
} from 'styles';

type Props = {};
export const ResetPasswordModal: FC<Props> = ({}) => {
  return (
    <Pressable style={{ maxHeight: '80%', width: '100%' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppText
          size="xxlarge"
          weight="bold"
          textAlign="center"
          marginBottom={SPACING_XXSMALL}
        >
          Reset your password
        </AppText>
        <AppText marginBottom={SPACING_SMALL}>
          We are working on a better way for you to reset your password. In the
          meantime please contact us to request a password reset using one of
          the methods below.
        </AppText>
        <View style={styles.listItem}>
          <SVGIcon
            width={20}
            height={20}
            styles={{ marginRight: SPACING_XXSMALL }}
          >
            <MailSVG></MailSVG>
          </SVGIcon>
          <AppText size="large">gigstoryy@gmail.com</AppText>
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
      </ScrollView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: SPACING_XSMALL,
    paddingVertical: SPACING_MID,
    display: 'flex',
    flexDirection: 'column',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING_XXSMALL,
  },
});
