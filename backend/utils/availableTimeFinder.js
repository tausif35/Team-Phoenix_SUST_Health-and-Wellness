
let timeSlots = [
    "09:00 am",
    "09:30 am",
    "10:00 am",
    "10:30 am",
    "11:00 am",
    "11:30 am",
    "12:00 pm",
    "12:30 pm",
    "02:30 pm",
    "03:00 pm",
    "03:30 pm",
    "04:00 pm",
    "05:00 pm",
    "05:30 pm",
    "06:00 pm",
    "06:30 pm",
    "07:00 pm",
    "07:30 pm",
    "08:00 pm",
    "08:30 pm"
]

 const availableTimeFinder = (times) => {
    let availableTime = [];
    for (let i = 0; i < times.length; i++) {
        let timeSlot = times[i];
        let timeSlotIndex = timeSlots.indexOf(timeSlot);
        if (timeSlotIndex !== -1) {
            availableTime.push(timeSlots[timeSlotIndex]);
        }
    }
    return availableTime;
};
// var today = new Date();
// var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
// var time = today.getHours() + ":" + today.getMinutes();
// console.log(date);
// console.log(time);
// console.log(Date.now());