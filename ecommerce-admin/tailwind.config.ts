import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#7a5af8',
        'primary-800': '#026AA2',
        'primary-100': '#F5FBFF',
        'primary-200': '#E5F5FB',
        'primary-300': '#FCF9F1',
        'primary-400': '#0086C9',
        'pink-700': '#BE1181',
        'pink-300': '#FCCEEE',
        'pink-200': '#FCE7F6',
        'gray-900': '#0C111D',
        'gray-800': '#1A212C',
        'gray-600': '#4D5158',
        'gray-500': '#6C7077',
        'gray-200': '#E4E6E9',
        'green-800': '#067647',
        'green-700': '#0C9E5C',
        'green-600': '#0AAF65',
        'green-300': '#ABEFC6',
        'green-200': '#DCFAE6',
        'orange-600': '#DC6803',
        'orange-500': '#F79009',
        'cyan-800': '#008189',
        'cyan-700': '#1AA2A9',
        'red-600': '#CF2215',
        'red-500': '#DF2618',
        'red-200': '#FEE4E2',
        'nile-blue': '#172B4D',
        'blue-200': '#D6F2FF',
        'purple-500': '#7a5af8',

        white: '#ffffff',
        error: '#E61C1C',
        nevada: '#6A6F70',
        customOrange: '#EE7104',
      },
      fontWeight: {
        normal: '450',
        medium: '500',
        bold: '700',
        black: '900',
      },
    },
  },
  plugins: [],
};
export default config;
