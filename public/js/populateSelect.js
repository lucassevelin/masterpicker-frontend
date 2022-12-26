function populateSelect(collection, selectId){
    var db = firebase.firestore();
    db.collection(collection).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
        // Now that you have the data, create an option element for each item
        var option = document.createElement('option');
        option.value = doc.id;  // Set the value of the option to the document ID

        styledText = doc.id;
        option.text = styledText;  // Set the text of the option to the name field of the document
        
        // Append the option to the select element
        document.getElementById(selectId).appendChild(option);
        });
    })
    .catch(error => {
        console.log(error);
    });
  }