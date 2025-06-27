// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        slideDown: {
          '1%': { transform: 'translateY(-20%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
};
