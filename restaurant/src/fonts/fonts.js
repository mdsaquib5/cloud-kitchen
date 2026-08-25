import localFont from 'next/font/local';

export const inter = localFont({
  src: [
    { path: './inter/inter-v20-latin-200.woff2', weight: '200', style: 'normal' },
    { path: './inter/inter-v20-latin-300.woff2', weight: '300', style: 'normal' },
    { path: './inter/inter-v20-latin-regular.woff2', weight: '400', style: 'normal' },
    { path: './inter/inter-v20-latin-500.woff2', weight: '500', style: 'normal' },
    { path: './inter/inter-v20-latin-600.woff2', weight: '600', style: 'normal' },
    { path: './inter/inter-v20-latin-700.woff2', weight: '700', style: 'normal' },
    { path: './inter/inter-v20-latin-800.woff2', weight: '800', style: 'normal' },
    { path: './inter/inter-v20-latin-900.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
});

export const montserrat = localFont({
  src: [
    { path: './montserrat/montserrat-v31-latin-200.woff2', weight: '200', style: 'normal' },
    { path: './montserrat/montserrat-v31-latin-300.woff2', weight: '300', style: 'normal' },
    { path: './montserrat/montserrat-v31-latin-regular.woff2', weight: '400', style: 'normal' },
    { path: './montserrat/montserrat-v31-latin-500.woff2', weight: '500', style: 'normal' },
    { path: './montserrat/montserrat-v31-latin-600.woff2', weight: '600', style: 'normal' },
    { path: './montserrat/montserrat-v31-latin-700.woff2', weight: '700', style: 'normal' },
    { path: './montserrat/montserrat-v31-latin-800.woff2', weight: '800', style: 'normal' },
    { path: './montserrat/montserrat-v31-latin-900.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-montserrat',
  display: 'swap',
});

export const outfit = localFont({
  src: [
    { path: './outfit/outfit-v15-latin-200.woff2', weight: '200', style: 'normal' },
    { path: './outfit/outfit-v15-latin-300.woff2', weight: '300', style: 'normal' },
    { path: './outfit/outfit-v15-latin-regular.woff2', weight: '400', style: 'normal' },
    { path: './outfit/outfit-v15-latin-500.woff2', weight: '500', style: 'normal' },
    { path: './outfit/outfit-v15-latin-600.woff2', weight: '600', style: 'normal' },
    { path: './outfit/outfit-v15-latin-700.woff2', weight: '700', style: 'normal' },
    { path: './outfit/outfit-v15-latin-800.woff2', weight: '800', style: 'normal' },
    { path: './outfit/outfit-v15-latin-900.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-outfit',
  display: 'swap',
});
