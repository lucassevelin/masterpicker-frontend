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

    console.log(totalHP)
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