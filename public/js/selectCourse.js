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

    var row = checkbox.parentElement.parentElement;
    dataCells = row.cells;

    // Update total HP
    var newTotalHP;
    var formattedHP;
    if (dataCells[5].textContent.toString().length > 1){
        formattedHP = parseInt(dataCells[5].textContent.slice(0, -1));
    } else {
        formattedHP = parseInt(dataCells[5].textContent);
    }
    newTotalHP = totalHP + factor*formattedHP;
    document.getElementById("examTotal").innerHTML = newTotalHP;

    // Update advance HP
    var newAdvHP;
    if (dataCells[8].textContent.includes("A")) {
        newAdvHP = advHP + factor*formattedHP;
        document.getElementById("examAdvanced").innerHTML = newAdvHP;
    }

    // TODO: Fix profile HP
}

function toggleHighlight(checkbox) {
    console.log("Running coloring function")
    var element = checkbox.parentNode.parentNode
    console.log(element)
    var currColor = element.style.fontSize;
    console.log(currColor)
    var currAlpha = currColor.match(/[\d.]+/)[0];

    var newAlpha;
    currAlpha == 0.5 ? 1 : 0.5
    element.style.backGroundColor = currColor.replace(currAlpha, newAlpha);
}