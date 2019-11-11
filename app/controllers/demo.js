import Controller from '@ember/controller';

export default Controller.extend({
  fileName: 'default',
  showError: false,
  newShapeData: '',
  neighborCount:5,
  lonerCount: 0,
  rows: 16,
  cols: 16,
  columns: Ember.computed( function() {
    let cols = this.get('cols');
    let colums = [];
    for(let n=0;n<cols;n++) {
      colums.push(n);
    }
    return colums;
  }),
  speed: 0,
  processRunning: true,
  dataError: false,
  knownKneighbors: [],
  shapeData: [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0,0,0,1,1,0,0,0], 
  [0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
  [0,0,0,1,1,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,0,0,0,0,1,1,1,0,0,0], 
  [0,0,1,1,1,0,0,0,0,0,0,1,0,0,0],
  [0,0,1,1,1,0,0,0,0,0,0,1,0,0,0], 
  [0,0,0,0,0,1,1,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,1,1,0,0,1,1,1,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ],
  defaultShapeData: [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0,0,0,1,1,0,0,0], 
  [0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
  [0,0,0,1,1,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,0,0,0,0,1,1,1,0,0,0], 
  [0,0,1,1,1,0,0,0,0,0,0,1,0,0,0],
  [0,0,1,1,1,0,0,0,0,0,0,1,0,0,0], 
  [0,0,0,0,0,1,1,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,1,1,0,0,1,1,1,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ],
  actions: {
    //File Upload method.
    uploadFile(file) {

      //Get some file info for display
      this.set("processRunning", true);
      this.set("fileName", file.name);

      //Read and process input file as a promise
      let rawDataPromise = file.readAsText(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      // Define our promise response.
      let self = this;
      rawDataPromise.then(function(textFile) {
        // No errors, process our file
        // Naughty eval!  Should a developer even trust correct data 
        // formatting to an eval in a demo?  Scary.
        let data = eval(textFile);
        self.set("shapeData", data);
        self.set("rows", data.length);
        self.set("cols", data[0].length);
        let knownKneighbors;
        let neighbors;
        // Check our data set for neighbors.
        [neighbors, knownKneighbors] = brfixEnumerateNeighbors(data);

        //Assign the display value
        self.set('neighborCount', neighbors.length);
        self.set('knownKneighbors', knownKneighbors);
        self.set("processRunning", false);
      }, function(reason) {
        //Something went wrong.
        self.set('showError', true);
        self.set("processRunning", false);
      });
    },
    restorDefault() {
      this.set("processRunning", true);
      let data = this.get("defaultShapeData");
      this.set("shapeData", data);
      this.set("rows", data.length);
      this.set("cols", data[0].length);
      this.set("fileName", "default");
      let neighbors;
      let knownKneighbors;
      // Check our data set for neighbors.
      [neighbors, knownKneighbors] = brfixEnumerateNeighbors(data);

      //Assign the display value
      this.set('neighborCount', neighbors.length);
      this.set('knownKneighbors', knownKneighbors);
      this.set("processRunning", false);
    },
    genRandom(size) {
      this.set("processRunning", true);
      var data = [];
      for(var r=0;r<size;r++) {
        data[r] = [0];
        for(var c=0;c<size;c++) {
          data[r][c] = Math.floor(Math.random() * Math.floor(2));
        }
      }
      // let data = this.get("defaultShapeData");
      this.set("shapeData", data);
      // console.log(data);
      this.set("rows", data.length);
      this.set("cols", data[0].length);
      this.set("fileName", "random " + size.toString());
      let knownKneighbors;
      let neighbors;
      // Check our data set for neighbors.
      [neighbors, knownKneighbors] = brfixEnumerateNeighbors(data);

      //Assign the display value
      this.set('knownKneighbors', knownKneighbors);
      this.set('neighborCount', neighbors.length);
      this.set("processRunning", false);
    },
  }
});

function formatNeighbor(i, j){
  return i.toString() + "-" + (j).toString();
}

// Add a square to an existing neighborhood
function addNeighbor(lookup, indexNum, value) {

  let idxVal = [];

  if(lookup[indexNum] != undefined) {
    idxVal = lookup[indexNum];
  }

  idxVal.push(value);
  lookup[indexNum] = idxVal;

  return lookup;
}

/*
//
//  Take two entries, find the other entries in their neighborhood
//  reassign them to another neighborhood.  Reindex for good measure.
//
*/
function mergeNeighbors(lookup, kn, rVal, cVal) {
  
  // Favor the lower index number as it should have less members
  let moveVal = Math.max(kn[rVal], kn[cVal]);
  let indexVal = Math.min(kn[cVal], kn[rVal]);
  let moveList = lookup[moveVal];

  if(moveList == undefined) {
    moveVal ^= indexVal;
    moveList = lookup[moveVal];
    if(moveList == undefined) {
      // Search the index for the proper group
      // This really shouldn't be reached as we are re-indexing every time now.
      let lookupList = [];
      for (let n=0;n<lookup.length;n++) {
        lookupList = lookup[n];
        for(let j=0;j<lookupList.length;j++) {
          // Compare the lookup list against our entries to find their new index.
          if(lookupList[j] == rVal) {
            if(moveVal == kn[rVal]) {
              moveList = lookupList;
              moveVal = n;
            }
          }
          else if (lookupList[j] == cVal) {
            if(moveVal == kn[cVal]) {
              moveList = lookupList;
              moveVal = n;
            }
          }
        }
      }
    }
  }

  // reassign our indexes
  for (let n=0;n<moveList.length;n++) {
    addNeighbor(lookup, indexVal, moveList[n]);
  }

  //cleanup bad values and reindex
  delete lookup[moveVal];
  lookup.splice(moveVal, 1);

  // Reset the index.
  for(let n=0;n<lookup.length;n++) {
    let nList = lookup[n];
    if(Array.isArray(nList)) {
      for(let j=0;j<nList.length;j++) {
        kn[nList[j]] = n;
      }
    }
  }
  return kn, lookup;
}

/*
// Contains the logic to compare two entries, using indexes, 
// to decide the appropriate way to handle the entries.
//
// 1. Add current and potential
// 2. Add current to potential
// 3. Add potential to current
// 4. Merge current and potential
*/
function addOrMerge(neighbors, kns, current, potential) {

  // Our current square has not been indexed
  if(kns[current] == undefined) {
    // 1. Add current and potential
    if (kns[potential] == undefined) {
      // Generate a new neighborhood and assign current square to it
      addNeighbor(neighbors, neighbors.length, current);
      kns[current] = neighbors.length - 1;
      // Assign the potential neighbor to the neibhorhood of the current
      addNeighbor(neighbors, kns[current], potential);
      kns[potential] = kns[current];
    
    }
    // 2. Add current to potential
    else {
      // Assign the current neighbor to the neighborhood of the potential
      addNeighbor(neighbors, kns[potential], current);
      kns[current] = kns[potential];
    }
  }
  else {
    // 3. Add potential to current
    if (kns[potential] == undefined) {
      // Assign the potential neighbor to the neighborhood of the current
      addNeighbor(neighbors, kns[current], potential);
      kns[potential] = kns[current];
    }
    // 4. Merge current and potential
    else {
      // If they are not already in the same neighborhood, merge their neighborhoods
      if(kns[potential] != kns[current]) {
        mergeNeighbors(neighbors, kns, potential, current);
      }
    }
  }
}

function brfixEnumerateNeighbors(data) {
  let rowLen = data.length;
  // Assuming I don't have to check out of bounds here. Scary
  let colLen = data[0].length;
  let kns = {}; // Index of identified neighbors
  let neighbors = []; // Index of identified neighborhoods
  // console.log(data);

  // Go through the matrix top left to bottom right, and find the target, check their neighbors
  for(var i=0; i<rowLen;i++) {
    for(var j=0;j<colLen;j++) {
      // Target value
      if(data[i][j] === 1) {
        // Set default values to neighbors we care about, to avoid out of bounds array
        let below = (i+1 < rowLen ? data[i+1][j] : 0);
        let right = (j+1 < colLen ? data[i][j+1] : 0);
        let thisEntry = formatNeighbor(i, j);
        let belowEntry = formatNeighbor((i+1), j);
        let rightEntry = formatNeighbor(i, (j+1));
        
        if(right === 1) {
          addOrMerge(neighbors, kns, thisEntry, rightEntry);
        }

        if(below == 1) {
          addOrMerge(neighbors, kns, thisEntry, belowEntry);
        }
      }
    }
  }

  return [neighbors, kns]
}

