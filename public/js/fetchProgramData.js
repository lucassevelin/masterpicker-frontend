function fetchProgramData(program, tableID, selectedCol) {
    var db = firebase.firestore();

    var programCol = db.collection(selectedCol).doc(program).collection("courses")

    clearTable(tableID);
    var tableToFill = document.getElementById(tableID).getElementsByTagName('tbody')[0]

    programCol.get().then(snapshot => {
        snapshot.docs.forEach((doc) => {
            //console.log(doc.data())
            //console.log("Data is of type: " + doc.data().constructor)
            //console.log("Data is still of type: " + dataToPush.constructor)
            //console.log(doc.data())
            
            // Insert a row at the end of table
            var newRow = tableToFill.insertRow();

            // Insert a cell at the end of the row
            var newCell = newRow.insertCell();

            // Append a text node to the cell
            //var newText = document.createTextNode(doc.data().name);
            if (doc.data().link) {
                var newText = document.createElement("a")
                newText.setAttribute("href", doc.data().link)
                newText.setAttribute("target", "_blank")
                newText.innerText = doc.data().name
            } else {
                var newText = document.createTextNode(doc.data().name)
            }
            newCell.appendChild(newText);

            var newCell = newRow.insertCell();
            var newText = document.createTextNode(doc.data().code);
            newCell.appendChild(newText);

            var newCell = newRow.insertCell();
            var newText = document.createTextNode(doc.data().term);
            newCell.appendChild(newText);

            var newCell = newRow.insertCell();
            var newText = document.createTextNode(doc.data().timetableModule);
            newCell.appendChild(newText);

            var newCell = newRow.insertCell();
            var newText = document.createTextNode(doc.data().exam);
            newCell.appendChild(newText);

            var newCell = newRow.insertCell();
            //console.log(doc.data().multiplePeriods)
            /*if (doc.data().multiplePeriods) {
                var newText = document.createTextNode(doc.data().credits);
            } else {
                var newText = document.createTextNode(String(doc.data().credits + "*"));
            }*/
            newCell.appendChild(document.createTextNode(doc.data().credits));

            var newCell = newRow.insertCell();
            var cellContentECV;
            console.log(doc.data().ECV)
            if (doc.data().ECV == null){
                console.log("Error") 
            } else if (Object.keys(doc.data().ECV).length > 1) {
                console.log("ECV contains array")
                console.log(doc.data().ECV)
                cellContentECV = fixECV(doc.data().ECV);
            } else {
                console.log("ECV contains single entry")
                cellContentECV = Object.values(doc.data().ECV)[0]
            }
            var newText = document.createTextNode(cellContentECV);
            newCell.appendChild(newText);

            var newCell = newRow.insertCell();
            var newText = document.createTextNode(doc.data().fields);
            newCell.appendChild(newText);

            var newCell = newRow.insertCell();
            var newText = document.createTextNode(doc.data().level);
            newCell.appendChild(newText);

            var newCell = newRow.insertCell();
            var newCheckbox = document.createElement("input");
            newCheckbox.type = "checkbox";
            newCheckbox.setAttribute("onClick", "selectCourse(this)");
            newCell.appendChild(newCheckbox);
        })
    })
    console.log("Done!")
    document.getElementById(tableID).classList.remove("hidden")
}

function clearTable(tableID) {
    var Table = document.getElementById(tableID);
    //console.log(Table)
    Table.innerHTML = "";
    Table.innerHTML = '<tr><th onclick="sortTable(0)">Course name</th><th onclick="sortTable(1)">Course code</th><th onclick="sortTable(2)">Period</th><th onclick="sortTable(3)">Timetable module</th><th onclick="sortTable(4)">Exam?</th><th onclick="sortTable(5)">Credits</th><th onclick="sortTable(6)">E/C/V</th><th onclick="sortTable(7)">Main field of study</th><th onclick="sortTable(8)">Level</th><th onclick="sortTable(9)">Selected</th></tr>';
    document.getElementById(tableID).classList.add("hidden")
}

function fixECV(ecvMap) {
    ecvKey = Array.from(ecvMap)
    ecvArray = []
    for (i = 0;i <= Object.keys(ecvMap).length;i++) {
        ecvArray.push(Object.values(ecvMap)[i])
    }
    var uniqueECV = ecvArray.filter(onlyUnique);
    var fixedECV = uniqueECV.toString().replaceAll(",", "/")
    console.log(fixedECV)
    if(fixedECV.endsWith("/")) {
        fixedECV = fixedECV.slice(0,-1)
    }

    return fixedECV
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }