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

    var chart = c3.generate({
        bindto: '#total-income-spent',
        data: {
            columns: [
                ['Income spent', retrieveTotalDepensesMois()]
            ],
            type: 'gauge',
            color: {
                pattern: ['#FFFFFF'] // set the color to black using hex code
            }
        },
        gauge: {
            label: {
                format: function(value, ratio) {
                    if (value == 0) {
                        return '0'
                    } else {
                        return Math.round(ratio * 100) + '%';
                    }
                },
                show: true
            },
            min: 0,
            max: retreieveTotalIncomeMois(),
            width: 50
        },
        color: {
            pattern: [
                '#13FF00',
                '#61FF00',
                '#A2FF00',
                '#CDFF00',
                '#F3FF00',
                '#FFF300',
                '#FFD800',
                '#FFB900',
                '#FF8700',
                '#FF7000',
                '#FF6100',
                '#FF5900',
                '#FF3200',
                '#FF2A00',
                '#FF0000'
            ],
            threshold: {
                values: [
                    0,
                    retreieveTotalIncomeMois() / 14,
                    2 * retreieveTotalIncomeMois() / 14,
                    3 * retreieveTotalIncomeMois() / 14,
                    4 * retreieveTotalIncomeMois() / 14,
                    5 * retreieveTotalIncomeMois() / 14,
                    6 * retreieveTotalIncomeMois() / 14,
                    7 * retreieveTotalIncomeMois() / 14,
                    8 * retreieveTotalIncomeMois() / 14,
                    9 * retreieveTotalIncomeMois() / 14,
                    10 * retreieveTotalIncomeMois() / 14,
                    11 * retreieveTotalIncomeMois() / 14,
                    12 * retreieveTotalIncomeMois() / 14,
                    13 * retreieveTotalIncomeMois() / 14,
                    retreieveTotalIncomeMois()
                ]
            }

        },
        size: {
            height: 180
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