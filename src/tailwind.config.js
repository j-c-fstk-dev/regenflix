/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class", // Keep dark mode setting
    theme: {
      extend: {
        colors: {
          // Cozy Nature-Inspired Palette for Moms & Homeschool Families
          primary: {
            50: "#f7f9f7",
            100: "#eef3ee",
            200: "#a8c4a2", // Soft sage green
            300: "#8fb085", // Main sage green
            400: "#7a9c70",
            500: "#65885b",
            600: "#507446",
            700: "#3b6031",
            800: "#264c1c",
            900: "#113807"
          },
          // Warm earth tones
          earth: {
            peach: "#d4a574", // Warm peach
            clay: "#c49080", // Soft clay/terracotta
            sage: "#8fb085", // Sage green
            stone: "#a8b2a5", // Blue-gray stone
            cream: "#f4f0e8", // Warm cream
            sand: "#e8d5c4", // Sandy beige
            rust: "#c67e5c" // Warm rust/orange
          },
          // Neutrals with warmth
          neutral: {
            cream: "#f4f0e8", // Warm cream background
            "warm-white": "#fefcf9", // Slightly warm white
            "soft-gray": "#e5e1db", // Warm light gray
            "medium-gray": "#a8a5a0", // Warm medium gray
            "dark-sage": "#5a6b57", // Dark sage for text
            charcoal: "#3a3d3a" // Warm charcoal
          },
          // Accent colors for highlights
          accent: {
            "warm-gold": "#d4a574", // Warm gold/peach
            "soft-coral": "#c49080", // Soft coral
            "sage-blue": "#a8b2a5", // Sage blue-gray
            rust: "#c67e5c" // Warm rust
          },
          // Semantic colors with warmth
          success: "#8fb085", // Sage green
          error: "#c67e5c", // Warm rust instead of harsh red
          warning: "#d4a574", // Warm gold
          info: "#a8b2a5" // Sage blue-gray
        },
        fontFamily: {
          heading: ["Playfair Display", "serif"], // More elegant, cozy serif
          body: ["Inter", "sans-serif"], // Clean, readable sans-serif
          script: ["Dancing Script", "cursive"] // For decorative elements
        },
        fontSize: {
          xs: ["0.75rem", { lineHeight: "1.2rem" }],
          sm: ["0.875rem", { lineHeight: "1.4rem" }],
          base: ["1rem", { lineHeight: "1.6rem" }],
          lg: ["1.125rem", { lineHeight: "1.8rem" }],
          xl: ["1.25rem", { lineHeight: "1.8rem" }],
          "2xl": ["1.5rem", { lineHeight: "2rem" }],
          "3xl": ["1.875rem", { lineHeight: "2.4rem" }],
          "4xl": ["2.25rem", { lineHeight: "2.6rem" }],
          "5xl": ["3rem", { lineHeight: "1.1" }],
          "6xl": ["3.75rem", { lineHeight: "1.1" }]
        },
        borderRadius: {
          cozy: "12px", // Softer, more organic
          "cozy-lg": "20px", // Larger organic radius
          "cozy-xl": "28px", // Extra large organic
          organic: "30% 70% 70% 30% / 30% 30% 70% 70%" // Organic blob shape
        },
        boxShadow: {
          cozy: "0px 4px 20px rgba(143, 176, 133, 0.15)", // Soft sage shadow
          "cozy-hover": "0px 8px 30px rgba(143, 176, 133, 0.25)", // Deeper sage shadow
          warm: "0px 6px 25px rgba(212, 165, 116, 0.2)", // Warm peach shadow
          organic: "0px 10px 40px rgba(143, 176, 133, 0.12)" // Very soft organic shadow
        },
        animation: {
          "gentle-float": "gentleFloat 6s ease-in-out infinite",
          "soft-pulse": "softPulse 4s ease-in-out infinite",
          "organic-bounce": "organicBounce 2s ease-in-out infinite"
        },
        keyframes: {
          gentleFloat: {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-10px)" }
          },
          softPulse: {
            "0%, 100%": { opacity: "1" },
            "50%": { opacity: "0.8" }
          },
          organicBounce: {
            "0%, 100%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.05)" }
          }
        },
        backgroundImage: {
          "organic-gradient":
          "linear-gradient(135deg, #f4f0e8 0%, #eef3ee 50%, #e8d5c4 100%)",
          "warm-gradient": "linear-gradient(135deg, #d4a574 0%, #c49080 100%)",
          "sage-gradient": "linear-gradient(135deg, #8fb085 0%, #a8c4a2 100%)"
        }
      },
    },
    plugins: [], // We can add plugins later if needed for custom utilities
  }
