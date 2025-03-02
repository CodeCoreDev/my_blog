import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Добавить другие пути при необходимости
  ],
  theme: {
    extend: {
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to bottom, rgb(var(--color-base-100) / 0%), rgb(var(--color-base-100) / 100%))",
      },
      colors: {
        neutral: colors.neutral,
        // Добавить кастомные цвета если нужно
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["Roboto Mono", ...defaultTheme.fontFamily.mono], // Пример дополнительного шрифта
      },
    },
  },
  daisyui: {
    themes: [
      {
        dark: {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"], // Базовые настройки
          primary: "#2bdcd2",
          "primary-content": "#171717",
          secondary: "#016968",
          accent: "#2bdcd2",
          "accent-content": "#171717",
          info: "#2bdcd2",
          "info-content": "#171717",

          // Уточнённая палитра
          "base-100": "#171717",
          "base-200": "#242424",
          "base-300": "#303030",
          neutral: "#171717",

          // Состояния
          success: "#34d399",
          warning: "#fbbf24",
          error: "#f87171",

          // Дополнительные настройки
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.25rem",
        },
      },
    ],
    darkTheme: "dark", // Явное указание тёмной темы
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("daisyui"),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tailwindcss/forms"), // Для стилизации форм
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tailwindcss/typography"), // Для типографики
  ],
};
