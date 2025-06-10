/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      opacity: {
        '02': '.02',
      },
      screens: {
        'max-lg-custom': { max: '1020px' },
        'max-mobile': { max: '630px' },
        'max-mobile-xs': { max: '345px' },
        'min-lg-custom': { min: '1020px' },
        'max-900-width': { max: '900px' },
      },
      colors: {
        opacity: {
          white: 'rgba(0, 0, 0, 0.02)'
        },
        primary: {
          DEFAULT: "#253858",
          dark: "#344955",
          medium: "#50727B",
          light: "#505F79",
          green: '#00875A',
          lightGreen: '#E3FCEF',
          lightRed: '#FFEBE6',
          red: '#FF5630',
          yellow: '#FFAB00',
          lightYellow: '#FFFAE6',
          blue: '#0052CC',
          mint: '#00B8D9',
          grapes: '#6554C0',
          lightGrapes: '#EAE6FF',
          silver: '#97A0AF',
        },
        secondary: {
          medium: '#F4F5F7',
          light: '#A5ADBA',
          dark: '#D9D9D9',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms')
    ],
  }
}