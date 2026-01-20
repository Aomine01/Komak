/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    500: '#0B0B45',
                    600: '#090936',
                    700: '#070728',
                }
            }
        },
    },
    plugins: [],
}
