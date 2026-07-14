import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { readServiceIdFromDom } from './constants/services'

const serviceId = readServiceIdFromDom()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App serviceId={serviceId} />
  </StrictMode>,
)
