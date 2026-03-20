'use client'

import { createContext, useContext, useState } from 'react'
import { translations, type Lang } from './translations'

type LanguageContextType = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (typeof translations)[Lang]
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'EN',
  setLang: () => {},
  t: translations.EN,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('EN')

  function setLang(l: Lang) {
    setLangState(l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
