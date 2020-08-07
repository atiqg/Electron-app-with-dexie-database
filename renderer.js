// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
var worker = new Worker('./databaseWorker.js');
  
worker.onmessage = function(event){
  console.log("Database worker process is ", event.data);
  worker.terminate(); 
  
  document.querySelector("h1").innerHTML = (event.data);
  //console.log("worker is done working ");
};
worker.onerror = function (event){
  console.error(event.message, event);
};


var importExportDB = require("./importExportDatabase");

importExportDB.export_database();

var isPersisted = importExportDB.init_storage_persistence();
isPersisted.then(function(value){
    console.log(value);
});