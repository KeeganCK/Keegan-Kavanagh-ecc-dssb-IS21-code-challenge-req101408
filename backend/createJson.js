const uuid = require('uuid');
let obj = {
    projectsArray: []
}


productNames = ['operation', 'op', 'req', 'info'];
firstNames = ["Keegan", "Aragorn", "Milena", "Legolas", "Gimli", "Galadriel", "Frodo", "Sam", "Pipin" ,"Gandalf", "Jesse", "Jessica", "Collin", "Lisa", "Alan", "Adam", "Justin", "Justina", "Ruby", "Karen", "Jane", "Joe", "Joel", "Ellie", "Christie", "Craig", "Christina", "James", "Jason", "Shelly", "Jasmine", "Amanda", "Nadia", "Kelly"]
lastNames = ["Baggins", "Took", "Kavanagh", "Burden", "Restan", "Smith", "Doe", "Johnson", "Williams", "Jones", "Potter", "Garcia", "Rodriguez", "Davis", "Clark", "Edwards", "Moore", "Thompson", "Anderson", "Perez", "White", "Sanchez", "Young", "Allen", "Walker", "Lewis", "Adams", "Nelson", "Green", "Nguyen",  "Campbell", "Parker", "Cruz", "Diaz"]
startYears = ["2019", "2020", "2021", "2022", "2023"];
startMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
startDays = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"];
methodologies = ["Agile", "Waterfall"];

// create 40 random
for(let i = 0; i < 40; i++) {
    let developers = [];
    for(let j = 0; j < Math.floor(Math.random() * 4)+2; j++) {
        let developer = firstNames[Math.floor(Math.random() * 34)] + ' ' + lastNames[Math.floor(Math.random() * 34)];
        developers.push(developer);
    }
    tempObj = {
        productId: uuid.v4(),
        productName: productNames[Math.floor(Math.random() * 4)] + (i+1).toString(),
        productOwnerName: firstNames[Math.floor(Math.random() * 34)] + ' ' + lastNames[Math.floor(Math.random() * 34)],
        Developers: developers,
        scrumMasterName: developers[Math.floor(Math.random() * developers.length)],
        startDate: startYears[Math.floor(Math.random() * 5)] + '/' + startMonths[Math.floor(Math.random() * 12)] + '/' + startDays[Math.floor(Math.random() * 28)],
        methodology: methodologies[Math.floor(Math.random() * 2)],
        location: "https://github.com/bcgov/BC-Policy-Framework-For-GitHub"
    }
    obj.projectsArray.push(tempObj);
}
var json = JSON.stringify(obj);
let fs = require('fs');
fs.writeFile('projects.json', json, 'utf8', (err) => {
    if(err) {
        console.log(err);
    }
});