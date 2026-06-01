/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0b1220',
        foreground: '#f5f4ef',
        primary: '#00b4ff',
        'primary-foreground': '#0b1220',
        card: '#101a2d',
        'card-foreground': '#f5f4ef',
        muted: '#18243a',
        'muted-foreground': '#a8b3c7',
        accent: '#0d47a1',
        'accent-foreground': '#ffffff',
        border: 'rgba(245, 244, 239, 0.12)',
        input: 'rgba(245, 244, 239, 0.12)',
        ring: '#00e59b',
        destructive: '#e5484d',
        'destructive-foreground': '#ffffff',
        chart: {
          1: '#00b4ff',
          2: '#00e59b',
          3: '#7c3aed',
          4: '#0d47a1',
          5: '#6b7280',
        },
      },
      roboto: [
        'Roboto_400Regular',
        'Roboto_500Medium',
        'Roboto_700Bold',
      ],
    },
  },
  plugins: [],
}
