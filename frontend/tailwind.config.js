/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#0b0f14"
        },
        gradient: {
          primary: "from-blue-600 to-cyan-500",
          secondary: "from-purple-600 to-pink-500",
          success: "from-green-600 to-emerald-500",
          warning: "from-orange-600 to-amber-500"
        }
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
        "gradient-secondary": "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        "gradient-success": "linear-gradient(135deg, #16a34a 0%, #10b981 100%)",
        "gradient-warning": "linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)",
        "gradient-dark": "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
      }
    }
  },
  plugins: []
};
