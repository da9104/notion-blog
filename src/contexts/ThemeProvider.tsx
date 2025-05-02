import { ThemeProvider as NextThemeProvider } from "next-themes"
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

const ThemeProvider = ({ 
  children, 
  defaultTheme = "system", 
  enableSystem = true, 
  disableTransitionOnChange = true 
}: ThemeProviderProps) => {
  return <NextThemeProvider defaultTheme={defaultTheme} enableSystem={enableSystem} disableTransitionOnChange={disableTransitionOnChange}>{children}</NextThemeProvider>
}

export default ThemeProvider
