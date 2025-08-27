import { ThemeProvider } from '@/components/ThemeProvider'
import AppShell from '@/components/AppShell'

function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}

export default App
