// circular SVG progress ring + time display in the center
// props: seconds, totalSeconds, sessionType, isRunning
// ring color changes per sessionType:
//   work → pink, shortBreak → teal, longBreak → violet
// breathing animation when running (subtle scale pulse)
// shows MM:SS in the center

export default function TimerRing({ seconds, totalSeconds, sessionType, isRunning }) {
  // calculate stroke-dashoffset from seconds/totalSeconds for the ring progress
  // breathing animation via CSS class when isRunning

  // SVG ring here
  return (
    <></>
  )
}