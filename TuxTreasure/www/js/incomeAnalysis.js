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

    //card 1
    printTotalIncomeMois()

    //card 2
    var chart = c3.generate({
        bindto: '#total-income-per-tag',
        data: {
            columns: buildTagIncomeSumArray(),
            type: 'donut',
            onclick: function(d, i) { console.log("onclick", d, i); },
            onmouseover: function(d, i) { console.log("onmouseover", d, i); },
            onmouseout: function(d, i) { console.log("onmouseout", d, i); }
        },
        donut: {
            title: "% / tag ",
        },
        tooltip: {
            format: {
                value: function(value, ratio, id, index) {
                    return value + "€";
                }
            }
        }
    });




}
//----------------------------listeners----------------------------


//--------------------------building page util functions-------------------------------


// --------------------------database util functions----------------------------------------



// --------------------------chart config defnintion--------------------------------

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




function printTotalIncomeMois() {
    document.getElementById("sumIncome").innerHTML = retreieveTotalIncomeMois() + " €";
}

//weird names because copy paste, will fix later
//to be 100% honest probably will not
//sigh
function buildTagIncomeSumArray() {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let tagExpenses = {};

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = JSON.parse(localStorage.getItem(key));
        if (value.type === "income") {
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