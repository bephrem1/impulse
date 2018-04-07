
// Turns an epoch date to a formatted date.
// Example is as follows:
// epoch: 1522966853
// formatted date string: 4-5-2018
function epochToDateString(epoch){
    const dateObj = new Date(epoch * 1000);
    return formatDate(dateObj);
}

// Formats a date object into a date string of (m)m-(d)d-yyyy format
function formatDate(dateObj) {
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Gives month index from 0-11 therefore we add 1 to adjust for this
    const year = dateObj.getFullYear();
    return `${month}-${day}-${year}`;
}

// Returns the current epoch time
function nowAsEpoch(){
    return Math.floor((new Date).getTime()/1000);
}

module.exports.epochToDateString = epochToDateString;
module.exports.nowAsEpoch = nowAsEpoch;