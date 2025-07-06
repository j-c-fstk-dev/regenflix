// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Definições de tradução para strings da interface
const resources = {
  pt_BR: {
    translation: {
      "welcome": "Bem-vindo ao RegenFlix!",
      "browse_library": "Explorar Biblioteca",
      "sign_up": "Cadastre-se",
      "login": "Entrar",
      "home_page_title": "Página Inicial",
      "subscription_plans_title": "Escolha Seu Plano RegenFlix",
      "logout": "Sair",
      // ...outras strings da UI
    }
  },
  en_US: {
    translation: {
      "welcome": "Welcome to RegenFlix!",
      "browse_library": "Browse Library",
      "sign_up": "Sign Up",
      "login": "Login",
      "home_page_title": "Home Page",
      "subscription_plans_title": "Choose Your RegenFlix Plan",
      "logout": "Logout",
      // ...outras strings da UI
    }
  },
  es: {
    translation: {
      "welcome": "¡Bienvenido a RegenFlix!",
      "browse_library": "Explorar Biblioteca",
      "sign_up": "Registrarse",
      "login": "Iniciar Sesión",
      "home_page_title": "Página Principal",
      "subscription_plans_title": "Elige Tu Plan RegenFlix",
      "logout": "Cerrar Sesión",
      // ...outras strings da UI
    }
  }
};

i18n
  .use(initReactI18next) // Passa i18n para react-i18next.
  .init({
    resources,
    lng: localStorage.getItem('userPreferredLanguage') || 'pt_BR', // Tenta carregar do LocalStorage ou define padrão
    fallbackLng: 'pt_BR', // Idioma de fallback
    interpolation: {
      escapeValue: false // React já escapa valores para prevenir XSS
    }
  });

export default i18n;