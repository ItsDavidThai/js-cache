// Cache Class
// - write-back on store
// - fetch
// - cache miss handling
// - cache any type of data (basic data types, classes, other caches) in the same cache, e.g. cache is loosely typed
// - cache can be any size when constructed
// - should be able to handle multiple levels of caching (ie, be able to look into a larger/parent cache if there is a cache miss)


// Simple Fixed Array Class to limit Array Size
function FixedArray(size){
  this.size = size || 10
  this.list = []
}
FixedArray.prototype.getLength = function(){
    return this.list.length
}
FixedArray.prototype.write = function(index, value){
    if(index > this.size - 1){
        console.log('exceeds array size')
        return false
    }
    this.list[index] = value
}
FixedArray.prototype.push = function(value){
    if(this.list.length > this.size){
        console.log('exceeds array size')
        return false
    } else {
      this.list.push(value)
    }

}
FixedArray.prototype.read = function(index){
    return this.list[index]
}



// will stringify value passed in and will xor each char code and multiply by a FNV prime resulting in a unique hash
function addressHashing(value, hashingFactor){
    var hash = 0
    var hashingFactor = hashingFactor || 16777619
    JSON.stringify(value).split('').forEach(function(element){
        hash = hash ^ element.charCodeAt(0)
        hash *= hashingFactor
    })
    return hash
}
// hashing function to find the index in the initial set
function cacheSetHash(key, setSize){
  return key.length % setSize
}


// sets combine mapped and associative properties 
function jsCache(setSize, blockSize){
  this.setSize = setSize
  this.blockSize = blockSize  
  this.set = new FixedArray(setSize)

  // create empty arrays to hold data
  for(var i = 0; i < setSize; i++){
    this.set.write(i, new FixedArray(blockSize))
  }
}
// write information to cache after finding the set and the block
jsCache.prototype.writeToCache = function(key, value){
  var setIndex = cacheSetHash(key, this.setSize);
  var block = this.set.read(setIndex)
  var address = addressHashing(value)
  block.push([key, address, value])
}
// check to see if there is room 
jsCache.prototype.checkCacheSet = function(key){
  var setIndex = cacheSetHash(key, this.setSize)
  var setBlock = this.set.read(setIndex)
  var emptySpot = false
  var matchFound = false
  for(var i = 0; i < setBlock.list.length; i++){
    // check to see if there is an empty spot in block
    if(!setBlock.list[i]){
      emptySpot = true
    } else {
      // check to see if information is in the set
      if(setBlock.list[i][0] === key){
        matchFound = true
      }
    }
  }  
  // return an object with the status of this set
  return {
    emptySpot: emptySpot,
    matchFound: matchFound
    // TODO return also the block and index so we don't repeat code maybe refactor the caching
  }
}


// retrieve information from assoiative block
jsCache.prototype.retrieveFromBlock = function(key){
  var setIndex = cacheSetHash(key, this.setSize)
  var block = this.set.read(setIndex)
  for(var i = 0; i < block.size; i++){
    if(block.list[i]){
      if(block.list[i][0] === key){
        return block.list[i][2]        
      }
    }
  }
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


