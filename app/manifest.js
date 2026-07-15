export default function manifest() {
  return {
    name: 'Kanhaiya Lal Sharma — Software Engineer',
    short_name: 'Kanhaiya',
    description: 'Software engineer building production-grade products.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0B',
    theme_color: '#0A0A0B',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
  };
}
