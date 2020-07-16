
function getFormattedTime(){
    let now = new Date();
    return (now.getHours()<10?'0':'') + now.getHours() + ':' + (now.getMinutes()<10?'0':'') + now.getMinutes();
}