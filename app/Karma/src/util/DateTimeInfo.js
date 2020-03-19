export const formatAMPM = d => {
    let date = new Date(d);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    
    return strTime;
};

export const getMonthName = (d, long = false) => {
    let date = new Date(d);
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    var name = monthNames[date.getMonth()];
    if (!long) {
        name = name.substring(0, 3);
    }
    
    return name;
};
// returns date string in the format day/month/year
export const getDate = d => {
    const date = new Date(d);
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
};
