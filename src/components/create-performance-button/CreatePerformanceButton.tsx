import { AppText } from 'components/app-text';
import { IconColor, SVGIcon } from 'components/icon';
import { BorderedPlusSVG } from 'components/icon/svg-components';
import { FC } from 'react';
import { Pressable } from 'react-native';
import {
  COLOR_SECONDARY_XDARK,
  SPACING_XSMALL,
  SPACING_XXXSMALL,
} from 'styles';

export type CreatePerformanceButtonProps = {
  onPress: () => void;
};

export const CreatePerformanceButton: FC<CreatePerformanceButtonProps> = ({
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        paddingRight: SPACING_XXXSMALL,
        paddingLeft: SPACING_XXXSMALL,
      }}
    >
      <SVGIcon
        handlePress={onPress}
        color={IconColor.SECONDARY}
        styles={{ marginRight: SPACING_XSMALL }}
      >
        <BorderedPlusSVG></BorderedPlusSVG>
      </SVGIcon>
      <AppText textColor={COLOR_SECONDARY_XDARK}>Create gig</AppText>
    </Pressable>
  );
};
