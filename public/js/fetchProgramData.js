function fetchProgramData(program, tableID, selectedCol, spec=null) {
    var db = firebase.firestore();

    var programCol = db.collection(selectedCol).doc(program).collection("courses")

    clearTable(tableID);

    populateSpecs(selectedCol, program, 'fieldSelect', 'specSelect', db)

    var filter
    if (spec == null) {
        filter = false
    } else {
        filter = true;
    }
    //console.log(filter)
    var programData = [];
    var dataEntry = [];
    var programDataFiltered = [];
    //console.log(programData)

    programCol
    .orderBy("term", "asc")
    .orderBy("timetableModule", "asc")
    .orderBy("name", "asc")
    .get()
    .then(snapshot => {
        snapshot.docs.forEach((doc) => {
            dataEntry = [];
            //console.log(doc.data())
            if (doc.data().ecv == null){
                console.log("Error when loading ECV data")
                cellContentECV = "-"
            } else if (Object.keys(doc.data().ecv).length > 1) {
                cellContentECV = fixECV(doc.data().ecv);
            } else {
                cellContentECV = Object.values(doc.data().ecv)[0]
            }

            dataEntry = [doc.data().name, 
                doc.data().link ? doc.data().link : "#",
                doc.data().code,
                doc.data().term,
                doc.data().timetableModule,
                doc.data().exam,
                doc.data().credits,
                cellContentECV,
                doc.data().fields,
                doc.data().level];
            
            programData.push(dataEntry)
        })

        console.log("Fetch complete")
        //console.log(programData)
        //programDataFiltered = onlyUniqueNested(programData, [2, 3], [4, 6])
        programDataFiltered = programData;
        populateTable(tableID, programDataFiltered)
    })
    document.getElementById(tableID).classList.remove("hidden")
    return programDataFiltered;
}

function fixECV(ecvMap) {
    ecvArray = []
    for (i = 0;i <= Object.keys(ecvMap).length;i++) {
        ecvArray.push(Object.values(ecvMap)[i])
    }
    ecvArray.pop(ecvArray.length)
    var uniqueECV = ecvArray.filter(onlyUnique).sort();
    
    // Check for C/E and E
    for (i=0; i<=uniqueECV.length;i++) {
        if (i > 0) {
            if (uniqueECV[i-1].includes(uniqueECV[i]))
                uniqueECV.splice(i+1, 1)
        }
    }
    // Check for C/E and C
    for (i=0; i<uniqueECV.length;i++) {
        if(i<uniqueECV.length-1){
            if (uniqueECV[i+1].includes(uniqueECV[i]))
                uniqueECV.splice(i, 1)
        }
    }
    var fixedECV = uniqueECV.toString().replaceAll(",", "/")
    if(fixedECV.endsWith("/")) {
        fixedECV = fixedECV.slice(0,-1)
    }
    return fixedECV
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

function onlyUniqueNested(array, indices, exclude = []) {
    const seen = new Set();

    return array.filter((row) => {
        const key = indices
        .filter((i) => !exclude.includes(i))
        .map((i) => row[i])
        .join("|");
        if (seen.has(key)) {
        return false;
        } else {
        seen.add(key);
        return true;
        }
    });
  }

function populateSpecs(collection, program, fieldSelectID, specSelectID, db){
    clearSelect(fieldSelectID);
    clearSelect(specSelectID);
    //console.log("Fetching from " + collection + "/" + program)

    db.collection(collection).doc(program).get()
    .then(snapshot => {
        console.log(snapshot.data())
        // First get fields
        snapshot.data().fields.forEach(field => {
            var fieldOption = document.createElement('option');
            fieldOption.value = field;
            fieldOption.text = field;

            document.getElementById(fieldSelectID).appendChild(fieldOption)
        });
        console.log("Done fetching fields")

        // Then get specializations
        snapshot.data().specializations.forEach(spec => {
            var option = document.createElement('option');
            option.value = spec;
            option.text = spec;

            document.getElementById(specSelectID).appendChild(option)
        });
        console.log("Done fetching specializations")
    });
  }