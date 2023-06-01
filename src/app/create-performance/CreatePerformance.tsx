import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { DateInput } from 'components/date-input';
import { Dropdown } from 'components/dropdown';
import { ProfileImage } from 'components/profile-image';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import { useFormik } from 'formik';
import React, { FC, useContext } from 'react';
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
import * as Yup from 'yup';
import { CreatePerformanceStackParamList } from './create-performance.types';

type CreatePerformanceProps = NativeStackScreenProps<
  CreatePerformanceStackParamList,
  'CreatePerformance'
>;

interface PerformanceCreateFormValues {
  isFestival: string;
  venue: string;
  eventStartDate: string;
  eventEndDate: string;
  performanceDate: string;
}

const validationSchema = Yup.object({
  venue: Yup.string()
    .required('Required')
    .min(2, 'Must be at least 2 characters'),
  eventStartDate: Yup.string().required('Please select a event start date'),
  eventEndDate: Yup.string()
    .required('Please select an event end date')
    .when('eventStartDate', (eventStartDate, schema) => {
      return schema.test({
        name: 'dateComparison',
        exclusive: false,
        message: 'End date must be greater than or equal to start date',
        test: function (eventEndDate) {
          return isDefined(eventEndDate) && eventEndDate >= eventStartDate;
        },
      });
    }),
  performanceDate: Yup.string()
    .required('Please select a performance date')
    .when(
      ['eventStartDate', 'eventEndDate'],
      ([eventStartDate, eventEndDate], schema) => {
        return schema.test({
          name: 'dateComparison',
          exclusive: false,
          message: 'Performance date cannot fall outside event dates',
          test: function (performanceDate) {
            return (
              isDefined(performanceDate) &&
              performanceDate >= eventStartDate &&
              performanceDate <= eventEndDate
            );
          },
        });
      },
    ),
  isFestival: Yup.string()
    .required('Required')
    .oneOf(['Yes', 'No', 'yes', 'no']),
});

const CreatePerformance: FC<CreatePerformanceProps> = ({ navigation }) => {
  const { profileState } = useContext(ProfileContext);
  const { profileType, profileId } = profileState;

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

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    dirty,
  } = useFormik({
    initialValues: {
      venue: '',
      isFestival: 'No',
      performanceDate: '',
      eventStartDate: '',
      eventEndDate: '',
    },
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  function handleCancelClick() {
    navigation.goBack();
  }

  async function handleFormSubmit({
    isFestival,
    venue,
    eventStartDate,
    eventEndDate,
    performanceDate,
  }: PerformanceCreateFormValues) {
    // create the performance so we can tag the show in it
    const performanceCreateResult = await performanceCreate({
      performerId: profileId,
      eventStartDate: Math.ceil(new Date(eventStartDate).getTime() / 1000),
      eventEndDate: Math.ceil(new Date(eventEndDate).getTime() / 1000),
      // Convert to seconds so its a unix timestamp
      performanceDate: Math.ceil(new Date(performanceDate).getTime() / 1000),
      venueName: venue,
      eventType:
        isFestival.toLowerCase() === 'yes'
          ? EventType.MUSIC_FESTIVAL
          : EventType.MUSIC_CONCERT,
    });

    navigation.goBack();
  }

  const handlePerformanceDateChange = handleChange('performanceDate');
  const handlePerformanceDateBlur = handleBlur('performanceDate');

  const handleEventStartDateChange = handleChange('eventStartDate');
  const handleEventStartDateBlur = handleBlur('eventStartDate');

  const handleEventEndDateChange = handleChange('eventEndDate');
  const handleEventEndDateBlur = handleBlur('eventEndDate');

  // TODO: Add frontend validation of form fields e.g. performance date lies inbetween event start and end dates
  return (
    <>
      {profileType === ProfileType.PERFORMER && performer && (
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
            handleDateSelected={e => {
              if (e) {
                handleEventStartDateChange(e?.toLocaleDateString());
              }
            }}
            handleBlur={e => {
              handleEventStartDateBlur(e);
              console.log('asdsajda');
            }}
            value={values.eventStartDate}
            inputTitle="Event start date"
            touched={touched.eventStartDate ?? false}
            error={errors.eventStartDate}
          ></DateInput>

          <DateInput
            handleDateSelected={e => {
              if (e) {
                handleEventEndDateChange(e?.toLocaleDateString());
              }
            }}
            handleBlur={handleEventEndDateBlur}
            value={values.eventEndDate}
            inputTitle="Event end date"
            touched={touched.eventEndDate ?? false}
            error={errors.eventEndDate}
          ></DateInput>

          <AppText>Was it at a festival?</AppText>
          <Dropdown
            options={['Yes', 'No']}
            value={values.isFestival}
            onChange={handleChange('isFestival')}
          ></Dropdown>
          {/* {touched && error && (
                <AppText textColor={COLOR_ERROR}>{error}</AppText>
              )} */}

          <DateInput
            handleDateSelected={e => {
              if (e) {
                handlePerformanceDateChange(e?.toLocaleDateString());
              }
            }}
            handleBlur={handlePerformanceDateBlur}
            value={values.performanceDate ?? values.eventStartDate}
            inputTitle="Date you performed"
            touched={touched.performanceDate ?? false}
            error={errors.performanceDate}
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
