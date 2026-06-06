// useDragToCreate.js
// modular — to disable, remove import from index.jsx and remove dragHandlers prop from views

import { useRef } from 'react'

export default function useDragToCreate(onDragComplete) {
  const isDraggingRef = useRef(false)
  const dragStart = useRef(null)  
  const dragEnd = useRef(null)    

  function onMouseDown(day, hour, minute = 0) {
    
    dragStart.current = {day, hour, minute}
    isDraggingRef.current = true
    
  }

  function onMouseMove(day, hour, minute = 0) {
    // only if isDragging
    if(!isDraggingRef.current) return
    dragEnd.current = {day, hour, minute}
    // update dragEnd ref
}

function onMouseUp() {
    // only if isDragging
    if(!isDraggingRef.current) return
    isDraggingRef.current = false

    if(!dragEnd.current){
      dragEnd.current = { day: dragStart.current.day, hour: dragStart.current.hour + 1, minute: 0 }
    }
    const start = new Date(dragStart.current.day)
    start.setHours(dragStart.current.hour,0,0,0)
    const end = new Date(dragEnd.current.day)
    end.setHours(dragEnd.current.hour,0,0,0)

    if(end < start){
      ;[start, end] = [end, start]
    }
    onDragComplete({ start, end })
    dragStart.current = null
    dragEnd.current = null
  }
    // set isDragging to false
    // calculate start and end Date objects from dragStart and dragEnd
    // if end is before start, swap them
    // call onDragComplete({ start, end })
    // reset refs
  

  return {
    isDragging: isDraggingRef.current,
    dragHandlers: {
      onMouseDown: (e, day, hour) => { e.preventDefault(); onMouseDown(day, hour) },
      onMouseMove: (e, day, hour) => onMouseMove(day, hour),
      onMouseUp: (e) => onMouseUp()
    }
  }
}