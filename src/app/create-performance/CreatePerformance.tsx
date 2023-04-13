import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileInternalStackScreenProps } from 'app/profile/ProfileStackScreen';
import { AppText } from 'components/app-text';
import { DateInput } from 'components/date-input';
import { List, ListItem } from 'components/list';
import { ProfileImage } from 'components/profile-image';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import { Formik } from 'formik';
import { FC, useContext, useState } from 'react';
import { Button, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { usePerformanceCreateMutation } from 'store/performances/performances.queries';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import {
  BUTTON_COLOR_DISABLED,
  BUTTON_COLOR_PRIMARY,
  SPACING_SMALL,
  SPACING_XSMALL,
} from 'styles';
import { isDefined } from 'utils/utils';
import { CreatePerformanceStackParamList } from './create-performance.types';

type CreatePerformanceProps = CompositeScreenProps<
  NativeStackScreenProps<CreatePerformanceStackParamList, 'CreatePerformance'>,
  ProfileInternalStackScreenProps
>;

interface PerformanceCreateFormValues {
  isFestival: string;
}

const CreatePerformance: FC<CreatePerformanceProps> = ({ navigation }) => {
  const { profileState } = useContext(ProfileContext);
  const { profileType, profileId } = profileState;

  const [selectedVenue, setSelectedVenue] = useState<string>('');
  const [showVenueList, setShowVenueList] = useState<boolean>(false);
  const [eventStartDate, setEventStartDate] = useState<Date | undefined>(
    undefined,
  );
  const [eventEndDate, setEventEndDate] = useState<Date | undefined>(undefined);
  const [performanceDate, setPerformanceDate] = useState<Date | undefined>(
    undefined,
  );

  const venues = ['O2 Academy', 'The Forum', 'The Roundhouse', 'The Garage'];
  const {
    data: performers,
    isLoading: performersLoading,
    error: performersGetError,
  } = usePerformersGetQuery({
    queryParams: {
      id: profileId,
    },
  });

  const {
    mutateAsync: performanceCreate,
    isLoading: createPerformanceLoading,
    isError: isPerformanceCreateError,
  } = usePerformanceCreateMutation();

  const performer = performers?.[0];

  const loading = !performer && performersLoading;

  const error = !performer && !performersGetError;

  function handleVenueSelected(venue: string) {
    setSelectedVenue(venue);
  }

  function searchVenues() {}

  const handleCancelClick = function (form: PerformanceCreateFormValues) {
    console.log('cancelled');
  };

  async function handleFormSubmit(formValues: PerformanceCreateFormValues) {
    if (
      !performanceDate ||
      !eventStartDate ||
      !eventEndDate ||
      !selectedVenue ||
      !isDefined(formValues.isFestival)
    ) {
      throw Error('Form incomplete. At least one required field is undefined');
    }

    // create the performance so we can tag the show in it
    const performanceCreateResult = await performanceCreate({
      performerId: profileId,
      eventStartDate: Math.ceil(eventStartDate.getTime() / 1000),
      eventEndDate: Math.ceil(eventEndDate.getTime() / 1000),
      // Convert to seconds so its a unix timestamp
      performanceDate: Math.ceil(performanceDate.getTime() / 1000),
      venueName: selectedVenue,
      isFestival: formValues.isFestival.toLowerCase() === 'yes',
    });

    navigation.goBack();
  }

  return (
    <>
      {profileType === ProfileType.PERFORMER && performer && (
        <Formik
          initialValues={{
            isFestival: 'No',
          }}
          onSubmit={handleFormSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View
              style={{
                ...styles.flexColumnContainer,
                width: '100%',
                height: '100%',
                paddingBottom: SPACING_SMALL,
              }}
            >
              <View style={{ ...styles.flexRowContainer }}>
                <ProfileImage
                  styles={{ marginRight: SPACING_XSMALL }}
                  imageUrl={performer.imageUrl}
                ></ProfileImage>
                <AppText>{`New performance by ${performer.name}`}</AppText>
              </View>

              <AppText>Venue</AppText>
              <TextInput
                style={{
                  width: '100%',
                  display: 'flex',
                  ...styles.textInput,
                }}
                onPressIn={() => setShowVenueList(true)}
                onBlur={() => {
                  setShowVenueList(false);
                  handleBlur('venue');
                }}
                onChangeText={() => {
                  handleChange('venue');
                  searchVenues();
                }}
                value={selectedVenue}
                placeholder="e.g. Wireless Festival, O2 Academy Brixton"
              />
              <>
                {venues && showVenueList && (
                  <List
                    sidePadding="xxxsmall"
                    verticalPadding="none"
                    scrollable={true}
                    maxHeight={20}
                  >
                    {venues.map(venue => (
                      <Pressable
                        key={venue}
                        onPress={() => handleVenueSelected(venue)}
                      >
                        <ListItem>
                          <AppText>{venue}</AppText>
                        </ListItem>
                      </Pressable>
                    ))}
                  </List>
                )}
              </>

              <DateInput
                handleDateSelected={setEventStartDate}
                value={eventStartDate}
                inputTitle="Event start date"
              ></DateInput>

              <DateInput
                handleDateSelected={setEventEndDate}
                value={eventEndDate}
                inputTitle="Event end date"
              ></DateInput>

              <AppText>Was it at a festival?</AppText>
              <TextInput
                style={{ width: '100%', ...styles.textInput }}
                onChangeText={handleChange('isFestival')}
                onBlur={handleBlur('isFestival')}
                value={values.isFestival}
                placeholder="Yes/No"
              />

              <DateInput
                handleDateSelected={setPerformanceDate}
                value={performanceDate}
                inputTitle="Performance date"
              ></DateInput>

              <View
                style={{
                  ...styles.flexRowContainer,
                  marginTop: 'auto',
                }}
              >
                <View
                  style={{
                    flexGrow: 1,
                    flexShrink: 0,
                    marginRight: SPACING_SMALL,
                  }}
                >
                  <Button
                    color={BUTTON_COLOR_DISABLED}
                    onPress={handleCancelClick}
                    title="Cancel"
                  ></Button>
                </View>
                <View
                  style={{
                    flexGrow: 1,
                    flexShrink: 0,
                  }}
                >
                  <Button
                    color={BUTTON_COLOR_PRIMARY}
                    onPress={handleSubmit}
                    title="Create"
                  />
                </View>
              </View>
            </View>
          )}
        </Formik>
      )}
      {loading && <AppText>Loading...</AppText>}
      {error && <AppText>Error</AppText>}
    </>
  );
};

export default CreatePerformance;

const styles = StyleSheet.create({
  flexColumnContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
  flexRowContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textInput: {},
});
