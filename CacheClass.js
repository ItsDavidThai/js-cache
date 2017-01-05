// Cache Class
// - write-back on store
// - fetch
// - cache miss handling
// - cache any type of data (basic data types, classes, other caches) in the same cache, e.g. cache is loosely typed
// - cache can be any size when constructed
// - should be able to handle multiple levels of caching (ie, be able to look into a larger/parent cache if there is a cache miss)



// will stringify value passed in and will xor each char code and multiply by a FNV prime resulting in a unique hash
function addressHashing(value, hashingFactor) {
    var hash = 0
    var hashingFactor = hashingFactor || 16777619
    JSON.stringify(value).split('').forEach(function(element) { 
        hash = hash ^ element.charCodeAt(0)
        hash *= hashingFactor
    })
    return hash
}
// hashing function to find the index in the initial set
function cacheSetHash(key, cacheSetSize){
  return key.length % cacheSetSize
}
/*
  Queue Constructor
*/
function Queue() {
  this.queue = []
}
Queue.prototype.enqueue = function (value) {
  this.queue.push(value)
}
Queue.prototype.dequeue = function () {
  return this.queue.shift()
}
Queue.prototype.getSize = function () {
  return this.queue.length
}
Queue.prototype.getState= function () {
  return this.queue.slice()
}



// sets combine mapped and associative properties 
function jsCache(cacheSetSize, setBlockSize, store, parentCache) {
  this.cacheSetSize = cacheSetSize
  this.setBlockSize = setBlockSize
  this.parentCache = parentCache 
  this.store = store  
  this.cacheSets = []

  // create empty arrays to hold data
  for(var i = 0; i < cacheSetSize; i++){
    this.cacheSets[i] = new Queue
  }
}
// write information to cache after finding the set and the block
jsCache.prototype.writeToCache = function(key, value){
  // find the set using a hash
  var cacheSetsIndex = cacheSetHash(key, this.cacheSetSize);
  // find the position of the data in that set 
  var cacheBlock = this.cacheSets[cacheSetsIndex]
  var cacheLine = this.checkCacheSet(key)
  var parentCache = this.parentCache
  /*
    CACHE HIT
  */
  if(cacheLine["matchFound"] === true) {

    // update value in cache current cache
    cacheLine["data"][1] = value


  /*
    CACHE MISS
  */ 

  } else if (cacheLine["matchFound"] === false && cacheLine["hasRoom"] === true) {
    // add data to block
    // if cache-miss and there is no empty spot
    cacheBlock.enqueue([key, value])

  } else if (cacheLine["matchFound"] === false && cacheLine["hasRoom"] === false){
    // evict last element 
    cacheBlock.dequeue()
    // push in new data to the set
    cacheBlock.enqueue([key, value])
      // if there is no lower level cache, update the store
      this.writeToStore(key, value)

  }
  // update any lower level caches
  if(parentCache){
    parentCache.writeToCache(key, value)
  } 

}

jsCache.prototype.writeToStore = function(key, value) {
  this.store[key] = value
}

// check to see if there is room 
jsCache.prototype.checkCacheSet = function(key){
  debugger
  var cacheSetsIndex = cacheSetHash(key, this.cacheSetSize);
  var cacheSetBlock = this.cacheSets[cacheSetsIndex].getState()

  var hasRoom = cacheSetBlock.length < this.setBlockSize ? true : false;
  var matchFound = false
  var data;

  
  
  for(var i = 0; i < cacheSetBlock.length; i++){
    // check to see if there is an empty spot in block
    // TODO add a way to check if really empty of spot is altered

    if(!cacheSetBlock[i].length === 0){

    } else {
      // check to see if information is in the set
      if(cacheSetBlock[i][0] === key){
        matchFound = true
        data = cacheSetBlock[i]
      }
    }
  }

  // return an object with the status of this set
  return {
    hasRoom: hasRoom,
    matchFound: matchFound,
    data: data
  }
}


// retrieve information from assoiative block
jsCache.prototype.fetchData = function(key){
  var cacheLine = this.checkCacheSet(key)

  /*
    Cache Hit
  */
  if(cacheLine['matchFound']){
    return cacheLine['data'][1]
  } else {
  /*
    Cache Miss
  */
  debugger
    var parentCache = this.parentCache
    if(parentCache){
      return parentCache.fetchData(key)
    } else {
      return this.fetchDataFromStore(key)
    }

  }

}

jsCache.prototype.fetchDataFromStore = function(key) {
  debugger
  return this.store[key]
}
// information is in our cache
jsCache.cacheHit = function(purpose){
  // read


  // write

}


// information is not in our cache
// purose - read or write
jsCache.cacheMiss = function(purpose){
  

}

jsCache.writeBack = function(){
  

}

// store is represented as key:value pairs
// the key represents the address 
function Store(){
  this.store = {

  }
}

