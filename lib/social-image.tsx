import { ImageResponse } from 'next/og';

export const socialImageSize = { width: 1200, height: 630 };

export function createSocialImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#080D1F',
        color: '#FFFFFF',
        padding: '64px 72px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', fontSize: 42, fontWeight: 900 }}>
        KINO<span style={{ color: '#FF321F', marginLeft: 12 }}>XII</span>
      </div>
      <div style={{ display: 'flex', width: 110, height: 7, marginTop: 94, background: '#FF321F' }} />
      <div style={{ display: 'flex', fontSize: 76, fontWeight: 800, marginTop: 25, letterSpacing: -2 }}>
        Your next movie night.
      </div>
      <div style={{ display: 'flex', fontSize: 30, marginTop: 22, color: '#B5BAC7' }}>
        Discover movies. Find showtimes. Book your seats.
      </div>
      <div style={{ display: 'flex', flex: 1, alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', width: '100%', height: 1, background: '#30364A' }} />
      </div>
      <div style={{ display: 'flex', fontSize: 22, marginTop: 20, color: '#B5BAC7' }}>
        KINO XII CINEMAS
      </div>
    </div>,
    socialImageSize
  );
}
