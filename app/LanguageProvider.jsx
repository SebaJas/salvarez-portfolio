'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// The language choice used to live in Portfolio's own useState, so it reset on
// every navigation: switching to Spanish, opening the blog and coming back left
// the page in English again. Holding it here, above the router, keeps it across
// routes, and localStorage keeps it across visits.

const LanguageContext = createContext(null);
const STORAGE_KEY = 'portfolio-lang';
const SUPPORTED = ['en', 'es'];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  // Read after mount: localStorage does not exist while server-rendering, and it
  // can throw in private mode or with site data blocked.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.includes(saved)) setLang(saved);
    } catch {
      // No stored preference available; English stays the default.
    }
  }, []);

  const chooseLang = (next) => {
    if (!SUPPORTED.includes(next)) return;
    setLang(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not persisting is fine — the choice still holds for this session.
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: chooseLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}
