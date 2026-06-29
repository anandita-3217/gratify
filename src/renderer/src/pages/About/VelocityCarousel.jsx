// import { useState, useRef } from 'react'
// import { motion, useMotionValue, animate } from 'framer-motion'
// import { Box, Group } from '@mantine/core'
// import PropTypes from 'prop-types'

// const CARD_WIDTH = 700 // px — should match your AboutCard width
// const CARD_GAP = 0// px between cards
// const INACTIVE_SCALE = 0.85
// const ACTIVE_SCALE = 1

// export default function VelocityCarousel({ cards, CardComponent }) {
//   const [activeIndex, setActiveIndex] = useState(0)
//   const dragX = useMotionValue(0)
//   const containerRef = useRef(null)
//   const isDragging = useRef(false)

//   const STEP = CARD_WIDTH + CARD_GAP

//   function goTo(index) {
//     setActiveIndex(index)
//     animate(dragX, -index * STEP, { type: 'spring', stiffness: 300, damping: 30 })
//   }

//   function handleDragEnd(_, info) {
//     const threshold = STEP / 3
//     if (info.offset.x < -threshold && activeIndex < cards.length - 1) {
//       goTo(activeIndex + 1)
//     } else if (info.offset.x > threshold && activeIndex > 0) {
//       goTo(activeIndex - 1)
//     } else {
//       // Snap back
//       animate(dragX, -activeIndex * STEP, { type: 'spring', stiffness: 300, damping: 30 })
//     }
//     // Small timeout so click-to-focus doesn't fire right after drag
//     setTimeout(() => {
//       isDragging.current = false
//     }, 50)
//   }

//   return (
//     <Box style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
//       {/* Track */}
//       <motion.div
//         ref={containerRef}
//         drag="x"
//         dragConstraints={{ left: -(cards.length - 1) * STEP, right: 0 }}
//         style={{
//           x: dragX,
//           display: 'flex',
//           gap: CARD_GAP,
//           cursor: 'grab',
//           paddingLeft: `calc(50% - ${CARD_WIDTH / 2}px)`, // Center the active card
//           paddingRight: `calc(50% - ${CARD_WIDTH / 2}px)`,
//           paddingTop: 20,
//           paddingBottom: 20,
//           userSelect: 'none'
//         }}
//         onDragStart={() => {
//           isDragging.current = true
//         }}
//         onDragEnd={handleDragEnd}
//         whileTap={{ cursor: 'grabbing' }}
//       >
//         {cards.map((cardProps, i) => (
//           <motion.div
//             key={i}
//             animate={{
//               scale: i === activeIndex ? ACTIVE_SCALE : INACTIVE_SCALE,
//               opacity: i === activeIndex ? 1 : 0.6
//             }}
//             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//             style={{
//               flexShrink: 0,
//               width: CARD_WIDTH,
//               transformOrigin: 'center center'
//             }}
//             onClick={() => {
//               if (!isDragging.current) goTo(i)
//             }}
//           >
//             <CardComponent {...cardProps} />
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Dot indicators */}
//       <Group justify="center" gap="xs" mt={8}>
//         {cards.map((_, i) => (
//           <motion.div
//             key={i}
//             animate={{
//               width: i === activeIndex ? 20 : 8,
//               backgroundColor:
//                 i === activeIndex ? 'var(--mantine-color-blue-5)' : 'var(--mantine-color-gray-5)'
//             }}
//             transition={{ duration: 0.3 }}
//             style={{
//               height: 8,
//               borderRadius: 999,
//               cursor: 'pointer'
//             }}
//             onClick={() => goTo(i)}
//           />
//         ))}
//       </Group>
//     </Box>
//   )
// }

// VelocityCarousel.propTypes = {
//   cards: PropTypes.arrayOf(PropTypes.object).isRequired,
//   CardComponent: PropTypes.elementType.isRequired
// }
// TODO: Rewrite this entire file