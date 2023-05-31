import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { DateInput } from 'components/date-input';
import { ProfileImage } from 'components/profile-image';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import { Formik } from 'formik';
import { FC, useContext, useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { EventType } from 'store/events/events.types';
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

type CreatePerformanceProps = NativeStackScreenProps<
  CreatePerformanceStackParamList,
  'CreatePerformance'
>;

interface PerformanceCreateFormValues {
  isFestival: string;
  venue: string;
}

const CreatePerformance: FC<CreatePerformanceProps> = ({
  navigation,
  route: {
    params: { performerId },
  },
}) => {
  const { profileState } = useContext(ProfileContext);
  const { profileType, profileId } = profileState;

  const [eventStartDate, setEventStartDate] = useState<Date | undefined>(
    undefined,
  );
  const [eventEndDate, setEventEndDate] = useState<Date | undefined>(undefined);
  const [performanceDate, setPerformanceDate] = useState<Date | undefined>(
    undefined,
  );

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
  } = usePerformanceCreateMutation({ performerId: profileId });

  const performer = performers?.[0];

  const loading = !performer && performersLoading;

  const error = !performer && !performersGetError;

  function handleCancelClick() {
    console.log('cancelled');
  }

  async function handleFormSubmit(formValues: PerformanceCreateFormValues) {
    if (
      !performanceDate ||
      !eventStartDate ||
      !eventEndDate ||
      !formValues.venue ||
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
      venueName: formValues.venue,
      eventType:
        formValues.isFestival.toLowerCase() === 'yes'
          ? EventType.MUSIC_FESTIVAL
          : EventType.MUSIC_CONCERT,
    });

    navigation.goBack();
  }

  // TODO: Add frontend validation of form fields e.g. performance date lies inbetween event start and end dates
  return (
    <>
      {profileType === ProfileType.PERFORMER && performer && (
        <Formik
          initialValues={{
            venue: '',
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
                onChangeText={handleChange('venue')}
                onBlur={handleBlur('venue')}
                value={values.venue}
                placeholder="e.g. Wireless Festival, O2 Academy Brixton"
              />

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
