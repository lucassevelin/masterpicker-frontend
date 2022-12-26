function fetchProgramData(program, tableID, selectedCol, spec=null) {
    var db = firebase.firestore();

    var programCol = db.collection(selectedCol).doc(program).collection("courses")

    clearTable(tableID);
    var tableToFill = document.getElementById(tableID).getElementsByTagName('tbody')[0]

    populateSpecs(selectedCol, program, 'specSelect', db)

    var filter
    if (spec == null) {
        filter = false
    } else {
        filter = true;
    }
    console.log(filter)

    programCol
    .orderBy("term", "asc")
    .orderBy("timetableModule", "asc")
    .orderBy("name")
    .get()
    .then(snapshot => {
        snapshot.docs.forEach((doc) => {
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
            //console.log("Raw data: " + doc.data().ecv)
            if (doc.data().ecv == null){
                console.log("Error when loading ECV data") 
            } else if (Object.keys(doc.data().ecv).length > 1) {
                //console.log("ECV contains array")
                //console.log(doc.data().ecv)
                cellContentECV = fixECV(doc.data().ecv);
            } else {
                //console.log("ECV contains single entry")
                cellContentECV = Object.values(doc.data().ecv)[0]
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
    Table.innerHTML = '<tr><th onclick="sortTable(0)">Course name</th><th onclick="sortTable(1)">Course code</th><th onclick="sortTable(2)">Period</th><th onclick="sortTable(3)">Timetable module</th><th onclick="sortTable(4)">Exam?</th><th onclick="sortTable(5)">Credits</th><th onclick="sortTable(6)">C/E/V</th><th onclick="sortTable(7)">Main field of study</th><th onclick="sortTable(8)">Level</th><th onclick="sortTable(9)">Selected</th></tr>';
    document.getElementById(tableID).classList.add("hidden")
}

function fixECV(ecvMap) {
    ecvArray = []
    for (i = 0;i <= Object.keys(ecvMap).length;i++) {
        ecvArray.push(Object.values(ecvMap)[i])
    }
    ecvArray.pop(ecvArray.length)
    console.log(ecvMap)
    console.log(ecvArray.sort())
    var uniqueECV = ecvArray.filter(onlyUnique).sort();
    
    // Check for C/E and E
    for (i=0; i<=uniqueECV.length;i++) {
        if (i > 0) {
            console.log("Previous E index: " + uniqueECV[i-1])
            if (uniqueECV[i-1].includes(uniqueECV[i]))
                console.log("Found extra E, removing " + uniqueECV[i].toString())
                uniqueECV.splice(i+1, 1)
                console.log(uniqueECV)
        }
    }
    console.log("Halfway done with array: " + uniqueECV.toString())
    // Check for C/E and C
    for (i=0; i<uniqueECV.length;i++) {
        console.log("On C iteration: " + i.toString())
        if(i<uniqueECV.length-1){
            console.log("Next C index: " + uniqueECV[i+1])
            if (uniqueECV[i+1].includes(uniqueECV[i]))
                console.log("Found extra C, removing " + uniqueECV[i].toString())
                uniqueECV.splice(i, 1)
                console.log(uniqueECV)
        }
    }

    console.log("Unique array: " + uniqueECV.toString())
    var fixedECV = uniqueECV.toString().replaceAll(",", "/")
    console.log("Fixed string: " + fixedECV)
    if(fixedECV.endsWith("/")) {
        fixedECV = fixedECV.slice(0,-1)
    }
    return fixedECV
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

function populateSpecs(collection, program, selectId, db){
    console.log("Fetching from " + collection + "/" + program)

    db.collection(collection).doc(program).get()
    .then(snapshot => {
        snapshot.data().specializations.forEach(spec => {
            var option = document.createElement('option');
            option.value = spec;
            option.text = spec;

            document.getElementById(selectId).appendChild(option)
        });
    });
  }