/** Required Modules
 ***************************************************************************************************/
const { query } = require("express");
const express = require("express");
const { animals } = require("./data/animals");
/** Global constants
 ***************************************************************************************************/

/** Global Variables
 ***************************************************************************************************/
// instantiate the server
var app = express();
// set the port of the app to use the environment port
const PORT = process.env.PORT || 3001;

/** Function definitions
 ***************************************************************************************************/
// filter the animal array by the query
function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  // Note that we save the animalsArry as a filterResults here:
  let filteredResults = animalsArray;

  if (query.personalityTraits) {
    // Save personalityTraits as dedicated array
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
  }
  // Loop through each trait in the personalityTraits array:
  personalityTraitsArray.forEach((trait) => {
    // Check the trait agaist each animal in the filteredResults array.
    // Remember, it is initially a copy of the animalsArray,
    // but here we're updating it for each trait in the .forEach() loop.
    // For each trait being trageted by the filter, the filteredResults
    // array will then contain only the entries that contain the trait,
    // so at the end we'll have an array of animals that have every one of
    // the traits when the .forEach() loop is finished.
    filteredResults = filteredResults.filter(
      (animal) => animal.personalityTraits.indexOf(trait) !== -1
    );
  });
  if (query.diet) {
    filteredResults = filteredResults.filter((animal) => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter((animal) => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter((animal) => animal.name === query.name);
  }

  //return filtered results
  return filteredResults;
}

// Taken an ID and array of animals returns a single animal object
function findById(id, animalsArray) {
  const result = animalsArray.filter((animal) => animal.id == id)[0];
  return result;
}
/** Main Program
 ***************************************************************************************************/
// add the route
//app.get("/api/animals", (req, res) => {
app.get("/api/animals", (request, response) => {
  let results = animals;
  // print in tterminal
  console.log(request.query);
  if (request.query) {
    results = filterByQuery(request.query, results);
  }
  //show in the browser
  response.json(results);
});

// The req object gives us access to another property for this case, req.params. Unlike the query
// object, the param object needs to be defined in the route path, with <route>/:<parameterName>.
app.get("/api/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

// listen for requests
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});
