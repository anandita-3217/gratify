import { useEffect, useRef } from 'react'

export default function useKeyboardShortcuts(shortcuts) {
  const shortcutsRef = useRef(shortcuts)
  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts])
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA') return

      for (const shortcut of shortcutsRef.current) {
        const ctrlmatch = shortcut.ctrl ? e.ctrlKey : !e.ctrlKey
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()
        if (ctrlmatch && keyMatch) {
          e.preventDefault()
          shortcut.action()
          break
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
