import * as React from 'react';
import { ClipPath, Defs, G, Path } from 'react-native-svg';
import { SVGProps } from '../icon.types';

export const BurgerMenuSVG: React.FC<SVGProps> = () => (
  <>
    <G
      fillRule="evenodd"
      clipPath="url(#a)"
      clipRule="evenodd"
    >
      <Path d="M22 11c0-.792-.477-1.435-1.064-1.435H1.065C.477 9.565 0 10.208 0 11s.477 1.435 1.065 1.435h19.87c.588 0 1.065-.643 1.065-1.435ZM22 1.435C22 .642 21.523 0 20.936 0H1.065C.477 0 0 .642 0 1.435 0 2.227.477 2.87 1.065 2.87h19.87c.588 0 1.065-.643 1.065-1.435ZM22 20.565c0-.792-.477-1.435-1.064-1.435H1.065C.477 19.13 0 19.773 0 20.565 0 21.358.477 22 1.065 22h19.87c.588 0 1.065-.642 1.065-1.435Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path d="M0 0h22v22H0z" />
      </ClipPath>
    </Defs>
  </>
);
