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

    //goto
    displayTagDepenseInDiv();





}
//----------------------------listeners----------------------------

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('beGoneTagExpediture').addEventListener('click', removeElementFromTagDepense);
});


//--------------------------building page util functions-------------------------------


// --------------------------database util functions----------------------------------------

function removeElementFromTagDepense() {
    let elementToRemove = document.getElementById("deleteTagExpenditure").value;
    console.log(elementToRemove);
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = JSON.parse(localStorage.getItem(key));
        if (value.type === "tagDepense") {
            let index = value.tagNames.indexOf(elementToRemove);
            if (index === -1) {
                alert(elementToRemove + " tag doesn't exist ! No need to remove it.");
                return;
            }
            value.tagNames.splice(index, 1);
            localStorage.setItem(key, JSON.stringify(value));
            displayTagDepenseInDiv();
            document.getElementById("deleteTagExpenditure").value = "";

            break;
        }
    }
}



// --------------------------chart config defnintion--------------------------------

function getAllTagDepenseValues() {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = JSON.parse(localStorage.getItem(key))
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


function displayTagDepenseInDiv() {
    let tags = getAllTagDepenseValues();
    document.getElementById("div-list-tag-depense").innerHTML = "";
    let div = document.getElementById("div-list-tag-depense");

    // Create a table element
    const table = document.createElement("table");
    table.style.width = "100%";

    // Create a table row element
    let tableRow = document.createElement("tr");

    // Loop through the tags
    for (let i = 0; i < tags.length; i++) {
        const tableData = document.createElement("td");
        tableData.style.border = "2px solid rgb(137, 137, 137)";
        tableData.style.transition = "transform 0.2s";
        tableData.style.cursor = "pointer";
        tableData.style.borderRadius = "4px";
        tableData.style.paddingLeft = "20px"
        tableData.style.paddingRight = "20px"

        const element = document.createElement("p");
        element.innerHTML = tags[i];

        element.addEventListener("mouseover", function() {
            element.style.transform = "translateX(15px)";
        });
        element.addEventListener("mouseout", function() {
            element.style.transform = "translateX(0)";
        });

        tableData.appendChild(element);
        tableRow.appendChild(tableData);

        // Add a new row after every third tag
        if (i % 3 === 2) {
            table.appendChild(tableRow);
            tableRow = document.createElement("tr");
        }
    }

    // Append the last row
    table.appendChild(tableRow);

    div.appendChild(table);

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



function printLocalStorageKeys() {
    for (let i = 0; i < localStorage.length; i++) {
        console.log(localStorage.key(i));
    }
}

function deleteFromLocalStorage(key) {
    localStorage.removeItem(key);
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

function retrieveTotalDepensesMois() {
    let depenses = [];
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = JSON.parse(localStorage.getItem(key));
        if (value.type === "depense") {
            let dateParts = value.date.split('/');
            let date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
            if (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear) {
                depenses.push(value.value);
            }
        }
    }

    let totalDepenses = 0;
    for (let i = 0; i < depenses.length; i++) {
        totalDepenses += parseInt(depenses[i]);
    }

    return totalDepenses;
}


function retreieveTotalIncomeMois() {
    let depenses = [];
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = JSON.parse(localStorage.getItem(key));
        if (value.type === "income") {
            let dateParts = value.date.split('/');
            let date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
            if (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear) {
                depenses.push(value.value);
            }
        }
    }

    let totalDepenses = 0;
    for (let i = 0; i < depenses.length; i++) {
        totalDepenses += parseInt(depenses[i]);
    }

    return totalDepenses;
}

function buildTagExpensesSumArray() {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let tagExpenses = {};

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = JSON.parse(localStorage.getItem(key));
        if (value.type === "depense") {
            let date = new Date(value.date.split("/").reverse().join("-"));
            let expenseMonth = date.getMonth();
            let expenseYear = date.getFullYear();
            if (expenseMonth === currentMonth && expenseYear === currentYear) {
                if (!tagExpenses[value.tag]) {
                    tagExpenses[value.tag] = 0;
                }
                tagExpenses[value.tag] += parseInt(value.value);
            }
        }
    }

    let expensesArray = [];
    for (let tag in tagExpenses) {
        expensesArray.push([tag, tagExpenses[tag]]);
    }

    return expensesArray;
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