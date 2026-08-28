import { MetadataRoute } from 'next';
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TECH KURUKSHETRA',
    short_name: 'TechKurukshetra',
    description: 'Join the ultimate coding and tech festival experience at TECH KURUKSHETRA. A two-day battlefield for developers, designers, and visionaries to learn, build, and conquer.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a001a',
    theme_color: '#9333ea',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
    ],
  };
}
