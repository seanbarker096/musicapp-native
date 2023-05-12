import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon';
import {
  LogoutSVG,
  UserAvatarBorderedSVG,
} from 'components/icon/svg-components';
import { List, ListItem } from 'components/list';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import { useContext } from 'react';
import { Pressable, View } from 'react-native';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { useLogoutMutation } from 'store/auth/auth.queries';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { SPACING_MID, SPACING_SMALL } from 'styles';

const Settings = () => {
  const { profileState, setProfileState } = useContext(ProfileContext);
  const { profileType } = profileState;

  const { authState, setAuthState } = useContext(AuthStateContext);
  const { authUser } = authState;

  const { mutate: logout } = useLogoutMutation();

  const settingItems = [];

  const {
    data: performers,
    isLoading: performersLoading,
    error: performersGetError,
  } = usePerformersGetQuery({
    queryParams: {
      ownerId: authUser.userId,
    },
  });

  const performer = performers?.[0];

  const loading = !performer && performersLoading;

  const error = !performer && performersGetError;

  // if the auth user owns an artist, the show them the option to switch to the artist account
  if (performer) {
    settingItems.push({
      text: `Switch to ${
        profileType === ProfileType.PERFORMER ? 'user' : 'artist'
      } account`,
      icon: UserAvatarBorderedSVG,
      // If user was previously viewing app as their artist profile, switch to user, otherwise switch to artist
      action: () =>
        profileState.profileType === ProfileType.PERFORMER
          ? setProfileState({
              profileType: ProfileType.USER,
              profileId: authUser.userId,
            })
          : setProfileState({
              profileType: ProfileType.PERFORMER,
              profileId: performer.id,
            }),
    });
  }

  settingItems.push({
    text: 'Logout',
    icon: LogoutSVG,
    action: logout,
  });

  return (
    <>
      {settingItems.length && (
        <View style={{ paddingLeft: SPACING_MID, paddingRight: SPACING_MID }}>
          <List>
            {settingItems.map(item => (
              <ListItem key={item.text}>
                <Pressable
                  style={{ flexDirection: 'row', marginBottom: SPACING_SMALL }}
                  onPress={() => item.action()}
                >
                  <SVGIcon styles={{ marginRight: SPACING_SMALL }}>
                    {item.icon()}
                  </SVGIcon>
                  <AppText>{item.text}</AppText>
                </Pressable>
              </ListItem>
            ))}
          </List>
        </View>
      )}
      {loading && <AppText>...Loading</AppText>}
      {error && <AppText>...Error</AppText>}
    </>
  );
};

export default Settings;
