import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon';
import { UserAvatarBorderedSVG } from 'components/icon/svg-components';
import { List, ListItem } from 'components/list';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import { useContext } from 'react';
import { Pressable, View } from 'react-native';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { SPACING_MID, SPACING_SMALL } from 'styles';

const Settings = () => {
  const { profileState } = useContext(ProfileContext);
  const { profileType } = profileState;

  const { authState } = useContext(AuthStateContext);
  const { authUser } = authState;

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
      action: () => console.log('pressed'),
    });
  }

  return (
    <>
      {performer && (
        <View style={{ paddingLeft: SPACING_MID, paddingRight: SPACING_MID }}>
          <List>
            {settingItems.map(item => (
              <ListItem>
                <Pressable
                  style={{ flexDirection: 'row' }}
                  onPress={item.action}
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
