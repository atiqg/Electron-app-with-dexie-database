const {database} = require('./databaseInit.js');
require('dexie-export-import');
const toBlob = require('stream-to-blob');
const fileSystem = require('fs');




var export_database = async function export_database(){
  console.log("Exporting Database");
  const blob = await database.export({prettyJson: true});
  const text = await new Response(blob).text(); 
  try{
    fileSystem.writeFile("ExportedDatabase.json", text, function(error){
     if(error){
        console.log(error);
      }
    });
  }catch(error){
    console.error(''+error);
  }
  console.log("Exported");
};


var import_database = async function import_database(){
  console.log("Importing Database");
  const stream = fileSystem.createReadStream("ExportedDatabase.json");
  const blob = await toBlob(stream);
  try{
    await database.import(blob);
  }catch(error){
    console.log('IMPORT ERROR: '+ error );
  }
  console.log("Imported");
};
 
async function try_persist_without_promting_user() {
  if (!navigator.storage || !navigator.storage.persisted) {
    return "never";
  }
  let persisted = await navigator.storage.persisted();
  if (persisted) {
    return "persisted";
  }
  if (!navigator.permissions || !navigator.permissions.query) {
    return "prompt"; // It MAY be successful to prompt. Don't know.
  }
  const permission = await navigator.permissions.query({
  name: "persistent-storage"
});
if (permission.status === "granted") {
   persisted = await navigator.storage.persist();
   if (persisted) {
      return "persisted";
    } else {
      throw new Error("Failed to persist");
    }
  }
  if (permission.status === "prompt") {
    return "prompt";
  }
  return "never";
}




var init_storage_persistence = async function init_storage_persistence() {
  console.log("persisting data");
  const persist = await try_persist_without_promting_user();
  switch (persist) {
  case "never":
    return "Not possible to persist storage";
  case "persisted":
    return "Successfully persisted storage silently";
  case "prompt":
    return "Not persisted, but we may prompt user when we want to.";
  }
}
module.exports = {
  export_database,
  import_database,
  init_storage_persistence
}