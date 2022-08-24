

exports.getDateFromISOString = (datetime) => {
    var date = (new Date(datetime).toISOString()).split('T')[0];
    return date;
}

exports.getTimeFromISOString = (datetime, milliseccond = true) => {
    var time = (new Date(datetime).toISOString()).split('T')[1];
    time = time.substring(0, time.length - 1 );
    if(milliseccond) return time;
    return time.split('.')[0];
}

exports.addDate = (
    datetime,
    {
        days,
        months,
        years,
        hours,
        minutes,
        seconds,
        millisecconds
    }) =>{
    let temp = 0;
    if(days) {
        temp += days*24*3600000; 
    }
    if(hours){
        temp += hours * 3600000;
    }
    if(minutes){
        temp += minutes * 60000;
    }
    if(seconds){
        temp += seconds * 1000;
    }
    if(millisecconds) {
        temp += millisecconds;
    }
    return new Date((new Date(datetime).getTime() + temp));
}

exports.countHoursFromDate = (dateStart,dateEnd)=>{
    const diff = new Date(dateEnd) - new Date(dateStart);
    let millisecconds, seconds, minutes, hours = 0;
    hours = Math.floor(diff / 3600000);
    minutes = Math.floor((diff-hours *3600000) / 60000);
    seconds = Math.floor((diff-(hours*3600000)-(minutes*60000)) / 1000);
    millisecconds = Math.floor((diff-(hours*3600000)-(minutes*60000)-(seconds*1000)));
    return {
        hours, minutes, seconds, millisecconds
    }
}