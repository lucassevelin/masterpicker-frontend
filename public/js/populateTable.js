function populateTable (tableID, dataArray) {
    var tableToFill = document.getElementById(tableID).getElementsByTagName('tbody')[0]

    dataArray.forEach(prog => {
        //Insert a row at the end of table
        var newRow = tableToFill.insertRow();

        // Insert a cell at the end of the row
        var nameCell = newRow.insertCell();

        // Append a text node to the cell
        var nameText = document.createTextNode(prog[0]);
        if (prog[1] != null) {
            nameText = document.createElement("a")
            nameText.setAttribute("href", prog[1])
            nameText.setAttribute("target", "_blank")
            nameText.innerText = prog[0]
        } else {
            nameText = document.createTextNode(prog[0])
        }
        nameCell.appendChild(nameText);

        var codeCell = newRow.insertCell();
        var codeText = document.createTextNode(prog[2]);
        codeCell.appendChild(codeText);

        var termCell = newRow.insertCell();
        var termText = document.createTextNode(prog[3]);
        termCell.appendChild(termText);

        var ttmCell = newRow.insertCell();
        var ttmText = document.createTextNode(prog[4]);
        ttmCell.appendChild(ttmText);

        newRow.classList.add("TTM-" + prog[4]) // Add ttm numbering as class, for coloring

        var examCell = newRow.insertCell();
        if (prog[5]) {
            examCell.innerHTML = '<i class="fa-solid fa-check"></i>';
        } else if (prog[5] == false) {
            examCell.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
            examCell.innerHTML = '<i class="fa-solid fa-question"></i>';
        }

        var creditsCell = newRow.insertCell();
        var creditsText = document.createTextNode(prog[6]);
        creditsCell.appendChild(creditsText);

        var ecvCell = newRow.insertCell();
        var ecvText = document.createTextNode(prog[7]);
        ecvCell.appendChild(ecvText);

        var fieldsCell = newRow.insertCell();
        var fieldsText = document.createTextNode(prog[8]);
        fieldsCell.appendChild(fieldsText);

        var levelCell = newRow.insertCell();
        var levelText = document.createTextNode(prog[9]);
        levelCell.appendChild(levelText);

        var checkboxCell = newRow.insertCell();
        var newCheckbox = document.createElement("input");
        newCheckbox.type = "checkbox";
        newCheckbox.setAttribute("onClick", "selectCourse(this)");
        checkboxCell.appendChild(newCheckbox);
    })
}

function clearTable(tableID) {
    var Table = document.getElementById(tableID);
    //console.log(Table)
    Table.innerHTML = "";
    Table.innerHTML = '<tr><th onclick="sortTable(0)">Course name</th><th onclick="sortTable(1)">Course code</th><th onclick="sortTable(2)">Period</th><th onclick="sortTable(3)">Timetable module</th><th onclick="sortTable(4)">Exam?</th><th onclick="sortTable(5)">Credits</th><th onclick="sortTable(6)">C/E/V</th><th onclick="sortTable(7)">Main field of study</th><th onclick="sortTable(8)">Level</th><th onclick="sortTable(9)">Selected</th></tr>';
    document.getElementById(tableID).classList.add("hidden")
}