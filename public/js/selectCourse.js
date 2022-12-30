function selectCourse(checkbox) {
    var totalHP = parseInt(document.getElementById("examTotal").innerHTML);
    var advHP = parseInt(document.getElementById("examAdvanced").innerHTML);
    var advHPProfile = parseInt(document.getElementById("examAdvancedProfile").innerHTML);
    var profileHP = parseInt(document.getElementById("examProfile").innerHTML);

    var factor;
    if (checkbox.checked) {
        factor = 1;
    } else {
        factor = -1;
    }

    toggleHighlight(checkbox)

    const row = checkbox.parentElement.parentElement;
    var dataCells = row.cells;

    // Update total HP
    var newTotalHP;
    var formattedHP;
    var multiPeriodCourse = false;
    if (dataCells[5].textContent.toString().length > 1){
        formattedHP = parseInt(dataCells[5].textContent.slice(0, -1))/2;
        multiPeriodCourse = true;
    } else {
        formattedHP = parseInt(dataCells[5].textContent);
        multiPeriodCourse = false;
    }
    newTotalHP = totalHP + factor*formattedHP;
    document.getElementById("examTotal").innerHTML = newTotalHP;

    // Update advance HP
    var newAdvHP;
    if (dataCells[8].textContent.includes("A")) {
        newAdvHP = advHP + factor*formattedHP;
        document.getElementById("examAdvanced").innerHTML = newAdvHP;
    }

    const selectedSpec = document.getElementById('fieldSelect').value;
    const selectedField = document.getElementById('specSelect').value;

    var newAdvHPProfile;
    if (dataCells[8].textContent.includes("A") && dataCells[7].includes(selectedField)) {
        newAdvHPProfile = advHPProfile + factor*formattedHP;
        document.getElementById("examAdvancedProfile").innerHTML = newAdvHPProfile;
    }
    

}

function toggleHighlight(checkbox) {
    console.log("Running coloring function")
    var element = checkbox.parentNode.parentNode
    console.log(element)
    var currColor = element.style.fontSize;
    console.log(currColor)
    if (currColor == null || currColor == "") {
        console.log("Unable to get color")
    } else {
        var currAlpha = currColor.match(/[\d.]+/)[0];
    }

    var newAlpha;
    currAlpha == 0.5 ? 1 : 0.5
    element.style.backGroundColor = currColor.replace(currAlpha, newAlpha);
}