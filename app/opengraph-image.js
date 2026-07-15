import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kanhaiya Lal Sharma — Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(180deg,#0A0A0B 0%,#0E0E10 100%)',
          color: '#F5F4F1', padding: '80px', fontFamily: 'ui-sans-serif',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 40, height: 4, background: '#0FA47A' }} />
          <div style={{ fontSize: 20, letterSpacing: 8, color: 'rgba(245,244,241,0.6)' }}>KANHAIYA · SOFTWARE ENGINEER</div>
        </div>
        <div style={{
          marginTop: 60, fontSize: 92, lineHeight: 1.02, letterSpacing: -3, fontWeight: 600,
          display: 'flex', flexDirection: 'column',
        }}>
          <span>I build production</span>
          <span>software that solves</span>
          <span style={{ color: '#0FA47A', fontStyle: 'italic', fontWeight: 400 }}>real problems.</span>
        </div>
        <div style={{
          position: 'absolute', bottom: 80, left: 80, right: 80,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          fontSize: 22, color: 'rgba(245,244,241,0.55)'
        }}>
          <div>Applied AI · Backend · Full-Stack</div>
          <div>kanhaiya.dev</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
