/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#0b0b47',
                'background-light': '#f6f6f8',
                'background-dark': '#121220',
                navy: {
                    500: '#0b0b47',
                    600: '#090938',
                    700: '#070728',
                }
            }
        },
    },
    plugins: [],
}
