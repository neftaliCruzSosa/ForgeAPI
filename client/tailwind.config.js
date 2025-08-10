/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}", // Example path for source files
      "./public/index.html", // Example path for public HTML file
    ],
    theme: {
      extend: {
        // Custom theme configurations (e.g., colors, fonts, spacing)
        fontFamily: {
          'sans': ['Roboto', 'sans-serif'],
        },
      },
    },
    plugins: [
      // Tailwind CSS plugins
    ]
  };