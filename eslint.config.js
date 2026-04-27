import js from "@eslint/js";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      "frontend/dist/**",
      "frontend/build/**",
      "backend/dist/**",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx,js,jsx}"],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        document: "readonly",
        window: "readonly",
      },
    },

    plugins: {
      react,
      "@typescript-eslint": tseslint.plugin,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "no-console": "off",

      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-require-imports": "off",
      eqeqeq: "off",
    },
  },
];
