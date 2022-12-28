import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { iconColorGenerator } from '../icon-utils';
import { IconColor, SVGProps } from '../icon.types';

export const HomeOutlineSVG = ({ color = IconColor.DARK }: SVGProps) => {
  const fill = iconColorGenerator(color);
  return (
    <Svg
      width={20}
      height={22}
      fill={fill}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.679 3.292c-.938-.9-2.42-.9-3.358 0L3.335 8.076a.806.806 0 0 0-.235.437 29.47 29.47 0 0 0-.13 9.862l.12.777H6.3v-6.694c0-.447.362-.809.808-.809h5.786c.446 0 .808.362.808.809v6.694h3.208l.121-.777c.511-3.271.467-6.605-.13-9.862a.807.807 0 0 0-.235-.437L11.68 3.292ZM7.202 2.125a4.042 4.042 0 0 1 5.596 0l4.987 4.785c.366.352.613.81.705 1.311a31.09 31.09 0 0 1 .138 10.404l-.195 1.247a1.06 1.06 0 0 1-1.047.897h-4.493a.808.808 0 0 1-.808-.809v-6.694h-4.17v6.694a.808.808 0 0 1-.808.809H2.614a1.06 1.06 0 0 1-1.047-.897l-.195-1.247A31.086 31.086 0 0 1 1.51 8.22c.092-.5.338-.959.706-1.311l4.986-4.785Z"
      />
    </Svg>
  );
};
