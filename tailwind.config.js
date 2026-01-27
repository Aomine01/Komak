/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#0E3B2A',
                'accent': '#2FBF84',
                'background-light': '#f6f6f8',
                'background-dark': '#121220',
                green: {
                    500: '#2FBF84',
                    600: '#28a974',
                    700: '#1f8f5f',
                },
                darkgreen: {
                    500: '#0E3B2A',
                    600: '#0b2d1f',
                    700: '#081f15',
                }
            }
        },
    },
    plugins: [],
}
