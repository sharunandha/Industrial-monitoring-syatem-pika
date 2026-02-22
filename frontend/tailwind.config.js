/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Orbitron', 'sans-serif'],
      },
      colors: {
        // Pokemon Thunder Theme Colors
        thunder: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        electric: {
          400: '#38bdf8',
          500: '#0ea5e9',
        },
        stone: {
          950: "#0c0a09"
        },
        gradient: {
          thunder: "from-yellow-400 to-amber-500",
          electric: "from-sky-400 to-blue-500",
          pikachu: "from-yellow-300 to-orange-400",
        }
      },
      backgroundImage: {
        "gradient-thunder": "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)",
        "gradient-electric": "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
        "gradient-storm": "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
        "gradient-pikachu": "linear-gradient(135deg, #fde047 0%, #fb923c 100%)",
      },
      animation: {
        'thunder-pulse': 'thunderPulse 2s ease-in-out infinite',
        'zap': 'zap 0.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        thunderPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(252,211,77,0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(252,211,77,0.8)' },
        },
        zap: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    }
  },
  plugins: []
};
