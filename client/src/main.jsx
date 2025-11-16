import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import Redux components
import { Provider } from 'react-redux'
import store from './store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the entire App component with the Redux Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
