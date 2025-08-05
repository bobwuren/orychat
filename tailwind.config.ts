import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './app/**/*.{ts,tsx}',
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    darkMode: 'class', // important pour ShadCN
}

export default config
