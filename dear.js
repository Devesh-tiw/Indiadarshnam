console.log("hello freinds ");
//Header Area
//Siderbar Area
function updateEra(value) {
    let year = Number(value);
    let text = "";

    if (year <= -1500) {
        text = "Vedic Era (" + year + ")";
    } 
    else if (year <= -200) {
        text = "Classical Period (" + year + ")";
    } 
    else if (year <= 600) {
        text = "Early Historic (" + year + ")";
    } 
    else if (year <= 1200) {
        text = "Early Medieval (" + year + ")";
    } 
    else if (year <= 1526) {
        text = "Late Medieval (" + year + ")";
    } 
    else if (year <= 1857) {
        text = "Mughal & Maratha (" + year + ")";
    } 
    else if (year <= 1947) {
        text = "Colonial Era (" + year + ")";
    } 
    else {
        text = "Post-Independence (" + year + ")";
    }

    document.getElementById("eraprint").style.color = "black";
    document.getElementById("eraprint").innerHTML = text;
}
//Middle Area
//Fotter AREA