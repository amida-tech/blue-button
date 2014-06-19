//functions that will be incorporated later.



var testString = '3/23/2011 3:23 PM';

console.log(determineDatePrecision(testString));

function determineDatePrecision(dateString){

  //think about it when it's only a year
  var date;
  var yearMonthDay = dateString.substr(0, dateString.indexOf(' ')); // '72'
  var hourMinutes = dateString.substr(dateString.indexOf(' ')+1);
  hourMinutes = hourMinutes.trim();
  //start from the order the hour
  //time is not defined
  if(hourMinutes !== undefined && dateString.indexOf(' ') >= 0){
    //determine month, day, etc
    //splits to hh:mm, (A.M. or P.M.)
    date = new Date(dateString);

    var minutes = date.getMinutes();
    if(minutes > 0){
      return 'minute';
    }
    else if(minutes === 0){
      return 'hour';
    }
    return 'hour';
  }
else{
  var yearMonthDayArray = testString.split('/');
  if(yearMonthDayArray.length === 3){
    return 'day';
  }
  if(yearMonthDayArray.length === 2){
    return 'month';
  }
  if(yearMonthDayArray.length === 1){
    return 'year';
  }
}
  //if all those cases don't hold, then it's likely that it's a year.
  return 'year';
}
