function fetchProgramData(program, tableID, selectedCol) {
    var db = firebase.firestore();
    console.log(program)
    var programCol = db.collection(db, selectedCol, program, "courses")
    //console.log(programCol)

    clearTable(tableID);
    var tableToFill = document.getElementById(tableID).getElementsByTagName('tbody')[0]

    onSnapshot(programCol, (snapshot) => {
        snapshot.docs.forEach((doc) => {
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
            if (doc.data().multiplePeriods) {
                var newText = document.createTextNode(doc.data().credits);
            } else {
                var newText = document.createTextNode(String(doc.data().credits + "*"));
            }
            newCell.appendChild(newText);

            var newCell = newRow.insertCell();
            var newText = document.createTextNode(doc.data().ECV);
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
            newCheckbox.setAttribute("onClick", "colorRow(this)");
            newCell.appendChild(newCheckbox);
            // if(doc.data().ECV.startsWith("E")) {
            //     newCheckbox.checked = true;
            //     colorRow(newCheckbox)
            // }
        })
    })
    console.log("Done")
}