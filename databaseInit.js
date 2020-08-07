var Dexie = require('dexie');
var database = new Dexie("dexieDB");


database.version(1).stores({
  Friends: 'name,quality,issue'
})


database.open().catch(function(error){
  console.error("ERROR: "+ error);
});


module.exports = {
  database
}