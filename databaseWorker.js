const {database} = require('./databaseInit.js');
const lineByLine = require('n-readlines');
var duplicates=0, addedRecords=0, splitter;
const liner = new lineByLine('./data.txt');
let line, lineNumber = 0;
database.transaction('rw', database.Friends, async () => {
  while (line = liner.next()) {
      splitter = line.toString().split('<|>');
      await database.Friends.add({
      name: splitter[0],
      quality: splitter[1],
      issue: splitter[2]
    }).then(function(){
      addedRecords++
      lineNumber++;
    }).catch(function (e) {
      console.log(e.message);
      duplicates++;
      lineNumber++;
    });
  }
}).then(function(){
  postMessage("Duplicates " + duplicates.toString() + " Added " + addedRecords.toString());//use when you are using a web worker
}).catch(error => {
  console.error(error);
});