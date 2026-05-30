

export default function useCalendarGrid(){

    function getMonthGrid(year, month) {

        // → array of 35 Date objects (5 weeks) for the month grid
        const date = new Date(year, month, 1)
        const startDay = date.getDate()

        const startOffset = startDay === 0 ? 6 : startDay - 1;

        const grid = []
        for (let i = 0; i < 35; i++){
            grid.push(new Date(date))
            date.setDate(date.getDate() + 1)
        }
        return grid
    } 
    
    
    // getWeekDays(date)
    // → array of 7 Date objects for the week containing date
    
    // getHourSlots()
    // → array of 24 { hour, label } objects for the time grid
    
    // isSameDay(a, b)
    // → boolean
    
    function isToday(date){
        const today = date === new Date().date()
        return today
    }
    // → boolean
    
    // getEventsForDay(events, date)
    // → filtered array of events that fall on that day
      
    // getEventPosition(event, dayStart)
    // → { top, height } percentages for positioning in time grid  

}    

