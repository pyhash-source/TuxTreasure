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
        displayAllIncome();
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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('log-income').addEventListener('click', addIncome);
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
    navigator.vibrate(1000)
    let tagNameElement = document.getElementById("tagName");
    if (tagNameElement.value == "") {
        alert("Please fill in the name you wish to give your new tag.")
    } else {
        addElementToTagDepense(tagNameElement.value.trim());
        alert('Your tag was added !');
        insertOptions(getAllTagDepenseValues(), "tag");
        tagNameElement.value = "";
    }
}

function addTagIncomeToDB() {
    navigator.vibrate(1000)
    let tagNameElement = document.getElementById("income-tagName");
    if (tagNameElement.value == "") {
        alert("Please fill in the name you wish to give your new tag.")
    } else {
        addElementToTagIncome(tagNameElement.value.trim());
        alert('Your tag was added !');
        insertOptions(getAllTagIncomeValues(), "tag-income");
        tagNameElement.value = "";
    }
}

function addExpenditure() {
    navigator.vibrate(1000);
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


function addIncome() {
    navigator.vibrate(1000);
    let selectElement = document.getElementById("tag-income");
    let selectElementValue = selectElement.options[selectElement.selectedIndex].value;
    let montant = document.getElementById("income-amount").value;
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
        let incomeObject = {
            "type": "income",
            "value": montant,
            "tag": selectElementValue,
            "date": dateString
        };

        storeObjectInLocalStorage(incrementLocalStorageKey(), incomeObject);
        document.getElementById("income-amount").value = "";
        alert("Successfully logged expenditure !")
        console.log(incomeObject);
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

function retrieveAllIncome() {
    let income = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = JSON.parse(localStorage.getItem(key));
        if (value.type === "income") {
            let depense = {
                value: value.value,
                tag: value.tag,
                date: value.date
            };
            income.push(depense);
        }
    }
    return income;
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

function displayAllIncome() {
    let incomes = retrieveAllIncome();
    let incomeContainer = document.getElementById("income-list");
    incomeContainer.innerHTML = "";

    for (let i = 0; i < incomes.length; i++) {
        let income = incomes[i];
        let incomeElement = document.createElement("p");
        incomeElement.innerHTML = "(Income) Value: " + income.value + " | (Income) Tag: " + income.tag + " | (Income) Date: " + income.date;
        incomeContainer.appendChild(incomeElement);
    }
}

const originalButton = document.getElementById("originalButton");
const newButtonsContainer = document.getElementById("newButtonsContainer");

originalButton.addEventListener("click", function() {
    if (newButtonsContainer.style.display === "none") {
        newButtonsContainer.style.display = "flex";
        originalButton.innerText = "close me"
    } else {
        newButtonsContainer.style.display = "none";
        originalButton.innerText = "Analysis !"
    }
});