import React, { FC } from 'react';

export interface ListItemProps {
  children: React.ReactNode;
}

export type ListItemComponent = FC<ListItemProps>;

export const ListItem: FC<ListItemProps> = ({ children }) => {
  return <>{children}</>;
};
