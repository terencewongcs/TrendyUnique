/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'black': '#000000',
      'black-common': '#111827',
      'gray': '#6B7280',
      'gray-light': '#979797',
      'gray-bg': '#C4C4C4',
      'gray-border': '#CCCCCC',
      'gray-page': '#777777',
      'gray-page-border': '#ECEEEF',
      'gray-text': '#535353',
      'green-button': '#22C55E',
      'blue': '#5048E5',
      'red': '#FC5A44',
      'red-button': '#EF4444',
      'red-tip': '#EA3D2F',
      'yellow': '#FCE944',
      'white': '#FFFFFF'
    },
    extend: {
      maxHeight: {
        '9/10': '90%',
      },
      translate: {
        'm/5': '-50%'
      },
      width: {
        'plg': '18%',
        'pmd': '23%',
        '5.9/12': '49%'
      },
      margin: {
        '1/100': '1%'
      },
      borderRadius: {
        'circle': '50%'
      }
    },
  },
  plugins: [],
}

