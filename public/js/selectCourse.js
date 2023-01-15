function selectCourse(checkbox) {
    var totalHP = parseInt(document.getElementById("examTotal").innerHTML);
    var advHP = parseInt(document.getElementById("examAdvanced").innerHTML);
    var advHPProfile = parseInt(document.getElementById("examAdvancedProfile").innerHTML);
    var profileHP = parseInt(document.getElementById("examProfile").innerHTML);

    var courses = [];

    toggleHighlight(checkbox)

    const row = checkbox.parentElement.parentElement;
    var dataCells = row.cells;

    var factor;
    if (checkbox.checked) {
        factor = 1;
        courses.push([dataCells[1].textContent, dataCells[0].textContent, dataCells[5].textContent, dataCells[3].textContent, dataCells[4].textContent]);
        console.log("Adding");
    } else {
        factor = -1;
        courses.splice([dataCells[1].textContent, dataCells[0].textContent, dataCells[5].textContent, dataCells[3].textContent, dataCells[4].textContent])
        console.log("Removing")
    }

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

    const selectedSpec = document.getElementById('specSelect').value;
    const selectedField = document.getElementById('fieldSelect').value;

    console.log("Selected " + selectedField + " as field of study.")

    var newAdvHPProfile;
    if (dataCells[8].textContent.includes("A") && dataCells[7].textContent.includes(selectedField)) {
        newAdvHPProfile = advHPProfile + factor*formattedHP;
        console.log("New advance HP profile: " + newAdvHPProfile)
        document.getElementById("examAdvancedProfile").innerHTML = newAdvHPProfile;
    }
    
    // TODO: Count profile hp

    // Append course to table in right sidebar
    var sortedCourses = courses.sort(function(a, b) {
        return a[4] - b[4];
      });
    sortedCourses.forEach(course => {
        var chosenTable = document.getElementById("chosenTable");
        var chosenTableBody = chosenTable.getElementsByTagName("tbody")[0];

        for (let i = 2; i < chosenTableBody.rows.length; i++) {
            chosenTableBody.deleteRow(i);
        }

        var newRow = chosenTableBody.insertRow();

        newRow.insertCell().appendChild(document.createTextNode(course[0]));
        newRow.insertCell().appendChild(document.createTextNode(course[1]));
        newRow.insertCell().appendChild(document.createTextNode(course[2]));
        newRow.insertCell().appendChild(document.createTextNode(course[3]));
        newRow.insertCell().appendChild(document.createTextNode(course[4]));
    })

    // Hide table if no courses are selected
    if(totalHP+factor*formattedHP > 0) {
        document.getElementById("chosenTable").classList.remove("hidden");
    } else if (totalHP+factor*formattedHP == 0) {
        document.getElementById("chosenTable").classList.add("hidden");
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

function updateCredits(tableID) {
    var table = document.getElementById(tableID);
        var checkedArray = [];

        for (var i = 0; i <= table.rows.length; i++) {
          var checkbox = table.rows[i].cells[9].querySelector('input[type="checkbox"]');
          if(checkbox.checked) {
            checkedArray.push(checkbox);
          }
        }
    checkedArray.forEach(selectCourse)
}