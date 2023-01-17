import React, { FC, useState } from 'react';
import { Text, View } from 'react-native';
import { useFileGetQuery } from 'store/files/files.queries';
import { useUserGetQuery } from 'store/users';

interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => {
  const [hasProfileImage, setHasProfileImage] = useState(false);

  const { isLoading, isError, data, error } = useUserGetQuery({ id: 1 });

  const ready = data && !isLoading;

  const { data: dataTwo } = useFileGetQuery({
    queryParams: { uuid: data ? data[0].avatarFileUuid : undefined },
    enabled: !!ready,
  });

  const user = ready ? data[0] : undefined;

  console.log('avatar file', dataTwo);

  /************************* Templates ********************************/

  const Loading = () => <Text>Loading...</Text>;

  const Error = () => <Text>Error...</Text>;

  const UserProfileTemplate = () => {
    return (
      <Text>Just some placeholder text</Text>
      // <View>
      //   {user && <ProfileImage imgUrl={user.avatarFileUuid}></ProfileImage>}
      //   {!user && <Text>No user found</Text>}
      //   <Text>Jelani Blackman</Text>
      //   <Text></Text>
      //   <View>
      //     <View>
      //       <SVGIcon></SVGIcon>
      //     </View>
      //     <View>
      //       <SVGIcon></SVGIcon>
      //     </View>
      //     <View>
      //       <SVGIcon></SVGIcon>
      //     </View>
      //   </View>
      //   <View class="Gallery"></View>
      // </View>
    );
  };

  return (
    <View>
      {ready && <UserProfileTemplate></UserProfileTemplate>}
      {isLoading && <Loading></Loading>}
      {isError && <Error></Error>}
    </View>
  );
};

export default UserProfile;
