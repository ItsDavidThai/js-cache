// Cache Class
// - write-back on store
// - fetch
// - cache miss handling
// - cache any type of data (basic data types, classes, other caches) in the same cache, e.g. cache is loosely typed
// - cache can be any size when constructed
// - should be able to handle multiple levels of caching (ie, be able to look into a larger/parent cache if there is a cache miss)


/*
  Store Constructor
  - creates a store instance that the jsCache instance can use  
*/
function Store(){
  // store is represented as key:value pairs
  // the key represents the address
  this.store = {}
}

// hashing function to find the index in the initial set
function cacheSetHash(key, cacheSetSize){
  return key.length % cacheSetSize
}

/*
  Queue Constructor
  - Used to handle evictions when a cache set is full
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



 /*
  jsCache Constructor
  - Create cache instances
  Params:[
    cacheSetSize: set the size of the cache
    setBlockSize: set the size of each block in a set
    store: set the reference to the store
    parentCache: set reference to deeper caches
  ]
 */ 
function jsCache(cacheSetSize, setBlockSize, store, parentCache) {
  this.cacheSetSize = cacheSetSize
  this.setBlockSize = setBlockSize
  this.parentCache = parentCache 
  this.store = store  
  this.cacheSets = []

  // create empty queues to be sets
  for(var i = 0; i < cacheSetSize; i++){
    this.cacheSets[i] = new Queue
  }


}

// public. jsCache Method that fetches data from our cache
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
    var parentCache = this.parentCache
    if(parentCache){
      // recursive calls from child -> parent on cache miss
      var data = parentCache.fetchData(key)
      // on cache miss fetch we allocate the data to the caches that had cache misses
      this.writeToCache(key, data)
      // return data from top most cache
      return data
    } else {
      // if caches all missed, fetch from store.
      var data = this.fetchDataFromStore(key)
      // allocate to the current cache
      this.writeToCache(key, data)
      return data
    }

  }

}

// public. write information to cache after finding the set and the block
jsCache.prototype.writeToCache = function(key, value){
  // find the set using a hash
  var cacheSetsIndex = cacheSetHash(key, this.cacheSetSize);
  // find the position of the data in that set 
  var cacheSet = this.cacheSets[cacheSetsIndex]
  // get an object that holds information about the cache block
  var cacheBlock = this.checkCacheSet(key)
  var parentCache = this.parentCache
  /*
    CACHE HIT
  */
  if(cacheBlock["matchFound"] === true) {

    // update value in cache current cache
    cacheBlock["data"][1] = value


  /*
    CACHE MISS
  */ 
    // if cache-miss and there is room in the block
  } else if (cacheBlock["matchFound"] === false && cacheBlock["hasRoom"] === true) {
    // add data to block
    cacheSet.enqueue([key, value])

    // if cache-miss and there is no empty spot
  } else if (cacheBlock["matchFound"] === false && cacheBlock["hasRoom"] === false){

    // evict last element 
    cacheSet.dequeue()
    // push in new data to the set
    cacheSet.enqueue([key, value])
      // if there is no lower level cache, update the store
      this.writeToStore(key, value)

  }
  // update any lower level caches
  if(parentCache){
    parentCache.writeToCache(key, value)
  } 

}

// private. jsCache Method to write data to the store 
jsCache.prototype.writeToStore = function(key, value) {
  this.store[key] = value
}

// private. jsCache Method that checks the cache set for cache hit and misses
// Output: 
  // hasRoom(Boolean): true if cache has room
  // matchFound(Boolean): true if requested data was found in cache
  // data(Queue): a reference to the cache line if available otherwise returns undefined
// 
jsCache.prototype.checkCacheSet = function(key){
  // use the hash function to find the correct set index
  var cacheSetsIndex = cacheSetHash(key, this.cacheSetSize);
  // get a reference to the cache line
  var cacheSetBlock = this.cacheSets[cacheSetsIndex].getState()
  // compare the block size with the instance of this caches setblock size property
  var hasRoom = cacheSetBlock.length < this.setBlockSize ? true : false;
  // default value set to false
  var matchFound = false
  var data;

  for(var i = 0; i < cacheSetBlock.length; i++){
    // check to see if there is an empty spot in block
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


// private. js cache method
jsCache.prototype.fetchDataFromStore = function(key) {
  return this.store[key]
}



