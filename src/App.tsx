import { QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { queryClient } from './utils/queryClient'
import { ApplicationStage } from './components/Stage'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApplicationStage />
    </QueryClientProvider>
  )
}

export default App
