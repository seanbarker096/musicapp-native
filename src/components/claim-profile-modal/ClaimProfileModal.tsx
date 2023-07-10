import { AppText } from 'components/app-text';
import { IconColor, SVGIcon } from 'components/icon';
import {
  BorderedPlusSVG,
  CameraSVG,
  CrowdSVG,
} from 'components/icon/svg-components';
import { FC } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import {
  SPACING_LARGE,
  SPACING_MID,
  SPACING_XSMALL,
  SPACING_XXSMALL,
  SPACING_XXXSMALL,
} from 'styles';

type Props = {};
export const ClaimProfileModal: FC<Props> = ({}) => {
  return (
    <Pressable style={{ maxHeight: '80%', width: '100%' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppText
          textAlign="center"
          marginBottom={SPACING_XXSMALL}
        >
          Claim this artists profile
        </AppText>
        <AppText
          size="small"
          weight="light"
          textAlign="center"
          marginBottom={SPACING_MID}
        >
          If you are the artist, or a member of their team, you can request to
          control this artist profile.
        </AppText>
        <SVGIcon
          height={30}
          width={30}
          color={IconColor.PRIMARY}
          styles={{ marginBottom: SPACING_XXXSMALL }}
        >
          <CameraSVG></CameraSVG>
        </SVGIcon>

        <AppText
          size="regular"
          textAlign="center"
          marginBottom={SPACING_XXXSMALL}
          weight="bold"
        >
          Fan captures
        </AppText>
        <AppText
          weight="light"
          size="small"
          textAlign="center"
          marginBottom={SPACING_MID}
          marginLeft={SPACING_XXSMALL}
        >
          If your request is successful, you'll gain full access to the artist
          profile. From there you can easily find and watch all the videos your
          fans have captured from your shows.
        </AppText>
        <SVGIcon
          height={30}
          width={30}
          color={IconColor.PRIMARY}
          styles={{ marginBottom: SPACING_XXXSMALL }}
        >
          <BorderedPlusSVG></BorderedPlusSVG>
        </SVGIcon>
        <AppText
          size="regular"
          textAlign="center"
          marginBottom={SPACING_XXXSMALL}
          weight="bold"
        >
          Create shows
        </AppText>

        <AppText
          weight="light"
          size="small"
          textAlign="center"
          marginBottom={SPACING_MID}
          marginLeft={SPACING_XXSMALL}
        >
          Claiming a profile allows you to manage the creation of shows for this
          artist. Fans can link their videos to these shows, helping you build a
          collection of videos documenting your journey as an artist.
        </AppText>
        <SVGIcon
          height={40}
          width={40}
          color={IconColor.PRIMARY}
          styles={{ marginBottom: SPACING_XXXSMALL }}
        >
          <CrowdSVG></CrowdSVG>
        </SVGIcon>
        <AppText
          size="regular"
          textAlign="center"
          weight="bold"
          marginBottom={SPACING_XXXSMALL}
        >
          Interact with fans
        </AppText>
        <AppText
          size="small"
          weight="light"
          textAlign="center"
          marginLeft={SPACING_XXSMALL}
          marginBottom={SPACING_LARGE}
        >
          Features like 'Artist Picks' allow you to interact and give credit to
          the fans who record the best moments from your shows.
        </AppText>

        <AppText
          size="small"
          textAlign="center"
          weight="light"
        >
          To claim this profile, contact{' '}
          <Text style={{ fontWeight: '800' }}>@gigstoryy </Text>
          on Instagram with the aritst name.
        </AppText>
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
    alignItems: 'center',
  },
});
