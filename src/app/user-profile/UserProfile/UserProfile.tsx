import React, { FC } from 'react';
import styles from './UserProfile.module.scss';

interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => (
  <div className={styles.UserProfile}>
    UserProfile Component
  </div>
);

export default UserProfile;
