import { AppText } from 'components/app-text';
import { IconColor, SVGIcon, SVGProps } from 'components/icon';
import { FC } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SPACING_XSMALL, SPACING_XXSMALL } from 'styles';

interface PostFooterActionProps {
  actionCompleted: boolean;
  // State to define what an icon press does, and the UI to display, when the action has already been performed (e.g. A post has already been liked)
  actionCompletedState: PostFooterActionState;
  // State to define what an icon press does, and the UI to display, when the action has not yet been performed (e.g. A post has not yet been liked)
  actionUncompletedState: PostFooterActionState;
}

interface PostFooterActionState {
  onIconPress: () => void;
  text?: string;
  icon: FC<SVGProps>;
  iconColor?: IconColor;
}

export const PostFooterAction: FC<PostFooterActionProps> = ({
  actionCompleted,
  actionCompletedState,
  actionUncompletedState,
}) => {
  function handleIconPress() {
    if (actionCompleted) {
      actionCompletedState.onIconPress();
    } else {
      actionUncompletedState.onIconPress();
    }
  }

  return (
    <Pressable
      onPress={handleIconPress}
      style={{
        ...styles.flexRowContainer,
        marginRight: SPACING_XSMALL,
      }}
    >
      {actionCompleted ? (
        <>
          <SVGIcon
            color={actionCompletedState.iconColor}
            styles={{ marginRight: SPACING_XXSMALL }}
          >
            <actionCompletedState.icon></actionCompletedState.icon>
          </SVGIcon>
          {actionCompletedState.text && (
            <AppText>{actionCompletedState.text}</AppText>
          )}
        </>
      ) : (
        <>
          <SVGIcon
            color={actionUncompletedState.iconColor}
            styles={{ marginRight: SPACING_XXSMALL }}
          >
            <actionUncompletedState.icon></actionUncompletedState.icon>
          </SVGIcon>
          {actionUncompletedState.text && (
            <AppText>{actionUncompletedState.text}</AppText>
          )}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  flexRowContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
