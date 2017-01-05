describe("JSCacheClass", function() {
  var cache;
  var store = {

  }
  beforeEach(function() {
    cache2 = new jsCache(6,6, store)
    cache = new jsCache(3, 3, store, cache2)
  })

  it('should exist', function() {
    expect(cache).to.be.an('object')
  })

  describe('CacheHits', function() {
    it('should write to the cache', function() {
      cache.writeToCache('abc', 'foobar')
      var checkCache = cache.checkCacheSet('abc')
      expect(checkCache["data"]).to.deep.equal(['abc', 'foobar'])
      expect(checkCache["matchFound"]).to.equal(true)
    })
    it('should reupdate value on cache hit', function() {
      cache.writeToCache('abc', 'foobar')
      cache.writeToCache('abc', 'helloworld')
      var checkCache = cache.checkCacheSet('abc')
      expect(checkCache["data"]).to.deep.equal(['abc', 'helloworld'])
      expect(checkCache["matchFound"]).to.equal(true)
    })
    it('should writeback to store if information is evicted', function() {
      
    })
    it('should check if data is in cache or if there is room in the set', function() {
      cache.checkCacheSet() 
    })
    it('should update lower level stores if possible', function() {
      
    })
    describe('fetching data', function() {
      it('should fetch data from the cache', function() {
        cache.writeToCache('abc', 'foobar1')
        expect(cache.fetchData('abc')).to.equal('foobar1')        
      })
      it('should fetch from store if not in cache', function() {
        store['cde'] = 'edc123'
        expect(cache.fetchData('cde')).to.equal('edc123')        
      })
      it('should fetch from parent cache if not in current cache', function() {
        cache2.writeToCache('def', '123fed')
        expect(cache.fetchData('def')).to.equal('123fed')        
      })
    })
  })

  describe('CacheMisses', function() {
    describe('write back', function() {
      it('should evict data from the block when full and update the store with the evicted data', function() {
        // add data to cache
        cache.writeToCache('1', 'foobar')
        cache.writeToCache('2', 'foobar')
        cache.writeToCache('3', 'foobar')
        cache.writeToCache('4', 'helloworld')

        var checkCacheKey1 = cache.checkCacheSet('1')
        var checkCacheKey4 = cache.checkCacheSet('4')

        // adding 4 should evict the first item in queue
        // 1 [2,3,4]
        expect(store['4']).to.equal('helloworld')
        // after evicting should not be in cache
        expect(checkCacheKey1['matchFound']).to.equal(false)
        expect(checkCacheKey1['data']).to.equal(undefined)
      })
      
    })
  })

})

