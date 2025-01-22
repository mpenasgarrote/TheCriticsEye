import type { Config } from 'tailwindcss'

export default {
	darkMode: 'class', 
	content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'Inter',
					'ui-sans-serif',
					'system-ui',
					'sans-serif',
					'Apple Color Emoji',
					'Segoe UI Emoji',
					'Segoe UI Symbol',
					'Noto Color Emoji',
				],
			},
			colors: {
				primaryBlack: {
					default: '#202020',
					lighter: '#212529',
					light: '#333533',
				},
				primaryYellow: {
					default: '#FFD100',
					light: '#FFEE32',
				},
				primaryWhite: {
					default: '#D6D6D6',
				},
				errorColor: {
					light: '#DD2C2F',
					default: '#BD1F21',
					dark: '#9C191B',
				},
				scoreColor: {
					'light-green': '#4ad66d',
					'dark-green': '#2dc653',
					yellow: '#f3de2c',
					red: '#ef233c',
				},
			},
			animation: {
				shake: 'shake 0.4s ease-in-out',
				'fade-in': 'fadeIn 0.5s ease-out forwards', // La animación finaliza en "forwards" para mantener el estado final.
				'slide-down': 'slide-down 0.3s ease-out',
				fadeInScale: 'fadeInScale 0.3s ease-out forwards',
			},
			keyframes: {
				shake: {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-5px)' },
					'50%': { transform: 'translateX(5px)' },
					'75%': { transform: 'translateX(-5px)' },
				},

				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},

				'slide-down': {
					'0%': { opacity: '0', transform: 'translateY(-10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				fadeInScale: {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
			},
			backgroundImage: {
				'login-image': "url('/images/loginBackground.jpg')",
				'dark-gradient': 'linear-gradient(to bottom right, #1A1A1A, #0D0D0D)', // Negro claro a negro oscuro
			},
		},
	},
	plugins: [],
} satisfies Config
