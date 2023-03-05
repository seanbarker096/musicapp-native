/* ----------- TAG CREATE ------------ */

import { useMutation } from 'react-query';
import { Tag, TagCreateRequest } from './tags.types';

export const useTagCreateMutation = () => {
  return useMutation<Tag, any, TagCreateRequest>(() => {}, {});
};
