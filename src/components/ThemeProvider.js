import React, { createContext, useContext } from 'react'

const ThemeContext = createContext({
  colors: {
    primary: 'bg-[#0F4C81] text-white',
    secondary: 'bg-[#FF6B6B] text-white',
    accent: 'bg-[#4ECDC4] text-white',
    background: 'bg-[#F7F7F7]',
    text: 'text-[#2F2F2F]',
    lightText: 'text-white',
  },
  hover: {
    primary: 'hover:bg-[#0D3D6A]',
    secondary: 'hover:bg-[#FF5252]',
    accent: 'hover:bg-[#45B7AC]',
    blue: 'hover:bg-[#2F80ED]',
  },
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{
      colors: {
        primary: 'bg-[#0F4C81] text-white',
        secondary: 'bg-[#FF6B6B] text-white',
        accent: 'bg-[#4ECDC4] text-white',
        background: 'bg-[#F7F7F7]',
        text: 'text-[#2F2F2F]',
        lightText: 'text-white',
      },
      hover: {
        primary: 'hover:bg-[#0D3D6A]',
        secondary: 'hover:bg-[#FF5252]',
        accent: 'hover:bg-[#45B7AC]',
        blue: 'hover:bg-[#2F80ED]',
      },
    }}>
      {children}
    </ThemeContext.Provider>
  )
}