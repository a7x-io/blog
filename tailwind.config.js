/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./pages/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			'ray-bg': '#ffffff',
  			'ray-surface': '#f8fafc',
  			'ray-card': '#ffffff',
  			'ray-accent': '#3b82f6',
  			'ray-accent-dark': '#2563eb',
  			'ray-muted': '#f1f5f9',
  			'ray-text': '#1e293b',
  			'ray-text-muted': '#64748b',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		backgroundImage: {
  			'ray-light': 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
  			'ray-dark': 'linear-gradient(135deg, #18181b 0%, #232326 100%)',
  			'gradient-blue': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
  			'gradient-blue-light': 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
  			'gradient-hero': 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)'
  		},
  		boxShadow: {
  			ray: '0 4px 32px 0 rgba(0,0,0,0.7)',
  			'ray-light': '0 4px 20px 0 rgba(59, 130, 246, 0.1)',
  			'ray-soft': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
  			'ray-medium': '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
  			'ray-strong': '0 8px 32px 0 rgba(0, 0, 0, 0.12)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

