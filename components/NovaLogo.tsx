import React from 'react';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

export default function NovaLogo({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Circle cx="20" cy="20" r="20" fill="#4f8ef7" />
      <Path
        d="M10 28 L20 12 L30 28"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle cx="20" cy="22" r="3" fill="#fff" />
    </Svg>
  );
}
