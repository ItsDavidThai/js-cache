describe("JSCacheClass", function() {
  var cache;
  var store; 

  beforeEach(function() {
    // before each test create new hash map
    store = new Store()
    // before each test create new caches
    cache2 = new jsCache(6,6, store);
    cache = new jsCache(3, 3, store, cache2);
    
  })

  it('should create a cache instance', function() {
    expect(cache).to.be.an('object');
  })

  describe('CacheHits', function() {
    
    describe('write(cache hit)', function() {
      it('should write to the cache', function() {
        cache.writeToCache('abc', 'foobar');
        var checkCache = cache.checkCacheSet('abc');
        expect(checkCache["data"]).to.deep.equal(['abc', 'foobar']);
        expect(checkCache["matchFound"]).to.equal(true);
      })

      it('should reupdate value in l1', function() {
        cache.writeToCache('abc', 'foobar');
        cache.writeToCache('abc', 'helloworld');
        var checkCache = cache.checkCacheSet('abc');
        expect(checkCache["data"]).to.deep.equal(['abc', 'helloworld']);
        expect(checkCache["matchFound"]).to.equal(true);
      })

      it('should update l2 when l1 cache is updated', function() {
        // write data to our cache
        cache.writeToCache('123', '321');
        cache.writeToCache('456', '654');
        // use cache method to check for data
        var checkCache2 = [
          cache2.checkCacheSet('123'),
          cache2.checkCacheSet('456')
        ]; 
        // writing to cache1 should update cache2        
        expect(checkCache2[0]["data"]).to.deep.equal(['123', '321']);
        expect(checkCache2[0]["matchFound"]).to.equal(true);
        expect(checkCache2[1]["data"]).to.deep.equal(['456', '654']);
        expect(checkCache2[1]["matchFound"]).to.equal(true);

        // should not update store
        expect(store['123']).to.equal(undefined);
        expect(store['456']).to.equal(undefined);
      })
    })
    
    describe('fetch(cache hit)', function() {
      it('should fetch data from the cache', function() {
        cache.writeToCache('abc', 'foobar1');
        expect(cache.fetchData('abc')).to.equal('foobar1');
      })
    })
  })

  describe('CacheMisses', function() {
    describe('write(cache miss)', function() {
      it('should evict data from the block when full and update the store with the evicted data (writeback)', function() {
        // add data to cache
        cache.writeToCache('1', 'foobar');
        cache.writeToCache('2', 'foobar');
        cache.writeToCache('3', 'foobar');
        cache.writeToCache('4', 'helloworld');

        var checkCacheKey1 = cache.checkCacheSet('1');
        var checkCacheKey4 = cache.checkCacheSet('4');

        // adding 4 should evict the first item in queue
        // 1 [2,3,4]
        expect(store['4']).to.equal('helloworld');
        // after evicting should not be in cache
        expect(checkCacheKey1['matchFound']).to.equal(false);
        expect(checkCacheKey1['data']).to.equal(undefined);
      })
      
      it('should write to l2 and then allocate to l1 if cache miss on l1', function() {
        // write only to l2
        cache2.writeToCache('1a', 'a1');
        // simulate a cache miss by fetching from data that l1 doesnt have but l2 does
        cache.fetchData('1a');
        // get the state of the set
        var checkCache1 = cache.checkCacheSet('1a');
        // check to see if the data is in the l1 cache
        expect(checkCache1['data']).to.deep.equal(['1a','a1']);
      })      

    })
    describe('fetch(cache miss)', function() {
    
      it('should fetch from store if not in cache', function() {
        // put item into store
        store['cde'] = 'edc123';
        // cache is empty should get the information from the cache
        expect(cache.fetchData('cde')).to.equal('edc123');
      })

      it('should fetch from parent cache if not in current cache', function() {
        // write data only to l2 cache
        cache2.writeToCache('def', '123fed');
        // request to l1 cache
        expect(cache.fetchData('def')).to.equal('123fed');
      })
      it('should allocate to l2 and l1 if fetched from store', function() {
        // set value in store
        store['c3'] = '3c';

        // initial state of our cache should be empty
        var checkCache1 = cache.checkCacheSet('c3');
        var checkCache2 = cache2.checkCacheSet('c3');
        expect(checkCache1['data']).to.equal(undefined);
        expect(checkCache2['data']).to.equal(undefined);

        // simulate a l1 and l2 cache miss
        cache.fetchData('c3');
        
        // recheck the state of our caches
        checkCache1 = cache.checkCacheSet('c3');
        checkCache2 = cache2.checkCacheSet('c3');
        
        // data should be allocated to l1 and l2 cache after cache
        expect(checkCache2['data']).to.deep.equal(['c3', '3c']);
        expect(checkCache1['data']).to.deep.equal(['c3', '3c']);

      })
    })
  })

})

