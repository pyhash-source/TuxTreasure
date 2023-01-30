document.addEventListener('deviceready', onDeviceReady, false);


function onDeviceReady() {
    document.getElementById('deviceready').classList.add('ready');
    if (localStorage.length == 0) {
        storeObjectInLocalStorage(incrementLocalStorageKey(), {
            "type": "tagDepense",
            "tagNames": ["Groceries", "Petrol", "Gym"]
        });

        storeObjectInLocalStorage(incrementLocalStorageKey(), {
            "type": "tagIncome",
            "tagNames": ["Wage", "Gifts", "State"]
        });
    } else {
        //do not remove or else very much broken
        deleteFromLocalStorage("debug");
    }


    //Dispatching the different functions to call:
    const pageName = window.location.pathname.split("/").pop();
    if (pageName == "logExpenditure.html") {
        //adding the different elements in the select options
        insertOptions(getAllTagDepenseValues(), "tag");
    } else if (pageName == 'analysis.html') {
        displayAllDepenses();
    } else if (pageName == 'logIncome.html') {
        insertOptions(getAllTagIncomeValues(), "tag-income")
    }

}
//----------------------------listeners----------------------------

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-tag').addEventListener('click', addTagToDB);
});


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-tag-income').addEventListener('click', addTagIncomeToDB);
});
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('log-expenditure').addEventListener('click', addExpenditure);
});
//--------------------------building page util functions-------------------------------
function insertOptions(stringsArray, tag) {
    console.log(stringsArray);
    var select = document.getElementById(tag);
    select.innerHTML = ""
    for (var i = 0; i < stringsArray.length; i++) {
        var option = document.createElement("option");
        option.text = stringsArray[i];
        select.add(option);
    }
    // document.body.appendChild(select);
}

// --------------------------database util functions----------------------------------------
function addElementToTagDepense(elementToAdd) {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        // if(key != 'debug') {

        // }
        let value = JSON.parse(localStorage.getItem(key));
        if (value.type === "tagDepense") {
            if (value.tagNames.includes(elementToAdd)) {
                alert(elementToAdd + " tag already exists ! No need to add it.");
                return;
            }
            value.tagNames.push(elementToAdd);
            localStorage.setItem(key, JSON.stringify(value));
            break;
        }
    }
}

function addElementToTagIncome(elementToAdd) {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        // if(key != 'debug') {

        // }
        let value = JSON.parse(localStorage.getItem(key));
        if (value.type === "tagIncome") {
            if (value.tagNames.includes(elementToAdd)) {
                alert(elementToAdd + " tag already exists ! No need to add it.");
                return;
            }
            value.tagNames.push(elementToAdd);
            localStorage.setItem(key, JSON.stringify(value));
            break;
        }
    }
}

function getAllTagDepenseValues() {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = JSON.parse(localStorage.getItem(key));
        if (value.type === "tagDepense") {
            return value.tagNames
        }
    }
}

function getAllTagIncomeValues() {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = JSON.parse(localStorage.getItem(key));
        if (value.type === "tagIncome") {
            return value.tagNames
        }
    }
}



function storeObjectInLocalStorage(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

function retrieveObjectFromLocalStorage(key) {
    let retrievedObject = JSON.parse(localStorage.getItem(key));
    return retrievedObject;
}


function incrementLocalStorageKey() {
    if (localStorage.length == 0) {
        return "1"
    } else {
        let highestKey = 1;

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let keyAsNumber = parseInt(key);
            if (keyAsNumber > highestKey) {
                highestKey = keyAsNumber;
            }
        }
        return String(highestKey + 1);
    }
}

function printLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        console.log(key + ": " + value);
    }
}

function printLocalStorageKeys() {
    for (let i = 0; i < localStorage.length; i++) {
        console.log(localStorage.key(i));
    }
}

function deleteFromLocalStorage(key) {
    localStorage.removeItem(key);
}

function addTagToDB() {
    let tagNameElement = document.getElementById("tagName");
    if (tagNameElement.value == "") {
        alert("Please fill in the name you wish to give your new tag.")
    } else {
        addElementToTagDepense(tagNameElement.value);
        alert('Your tag was added !');
        insertOptions(getAllTagDepenseValues(), "tag");
        tagNameElement.value = "";
    }
}

function addTagIncomeToDB() {
    let tagNameElement = document.getElementById("income-tagName");
    if (tagNameElement.value == "") {
        alert("Please fill in the name you wish to give your new tag.")
    } else {
        addElementToTagIncome(tagNameElement.value);
        alert('Your tag was added !');
        insertOptions(getAllTagIncomeValues(), "tag-income");
        tagNameElement.value = "";
    }
}

function addExpenditure() {
    let selectElement = document.getElementById("tag");
    let selectElementValue = selectElement.options[selectElement.selectedIndex].value;
    let montant = document.getElementById("amount").value;
    let date = new Date();
    let dateString = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    console.log(dateString); // Output: 28/01/2023
    if (montant == "") {
        alert("please enter the amount of money you spent !")
    } else {
        let depenseObject = {
            "type": "depense",
            "value": montant,
            "tag": selectElementValue,
            "date": dateString
        };

        storeObjectInLocalStorage(incrementLocalStorageKey(), depenseObject);
        document.getElementById("amount").value = "";
        alert("Successfully logged expenditure !")
    }

}

function retrieveAllDepenses() {
    let depenses = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = JSON.parse(localStorage.getItem(key));
        if (value.type === "depense") {
            let depense = {
                value: value.value,
                tag: value.tag,
                date: value.date
            };
            depenses.push(depense);
        }
    }
    return depenses;
}

function displayAllDepenses() {
    let depenses = retrieveAllDepenses();
    let depensesContainer = document.getElementById("expense-list");
    depensesContainer.innerHTML = "";

    for (let i = 0; i < depenses.length; i++) {
        let depense = depenses[i];
        let depenseElement = document.createElement("p");
        depenseElement.innerHTML = "Value: " + depense.value + " | Tag: " + depense.tag + " | Date: " + depense.date;
        depensesContainer.appendChild(depenseElement);
    }
}