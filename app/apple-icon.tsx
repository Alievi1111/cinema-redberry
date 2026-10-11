import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 34,
        background: '#080D1F',
        color: '#FFFFFF',
        fontFamily: 'sans-serif',
        fontSize: 100,
        fontWeight: 900,
      }}
    >
      K<span style={{ color: '#FF321F', fontSize: 34, marginLeft: 2 }}>XII</span>
    </div>,
    size
  );
}
