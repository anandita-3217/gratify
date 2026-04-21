import './assets/main.css'
import { MantineProvider, Modal, Button } from '@mantine/core'

import '@mantine/core/styles.css'
import { StrictMode, useState  } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// function Test() {
//   const [opened, setOpened] = useState(false)
//   return (
//     <div>
//       <Button onClick={() => setOpened(true)}>Open</Button>
//       <Modal opened={opened} onClose={() => setOpened(false)} title="Test">
//         <p>IT WORKS</p>
//       </Modal>
//     </div>
//   )
// }



createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <MantineProvider defaultColorScheme="dark">
    <App />
</MantineProvider>
  </StrictMode>
)
