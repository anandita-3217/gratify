import './assets/main.css'
import { MantineProvider, Modal, Button } from '@mantine/core'

import '@mantine/core/styles.css'
import { StrictMode, useState  } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={{ primaryColor: 'pink'}}>
    <App />
</MantineProvider>
  </StrictMode>
)
