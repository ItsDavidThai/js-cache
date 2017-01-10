How to Run Tests

	Open SpecRunner.html in your browser.



Cache Class Design

1.0 Design Considerations

	1.1 Assumptions
	Store is a javascript object(Hash Map). 
	When dealing with multiple cache layers, will use a fully inclusive approach where data from L2 wll be copied to L1.
	The last level cache is a superset of all higher level caches.
	Cache will use keys to store and find data.
	Javascript does not have public and private methods but intention is stated in comments

	1.2 General Purpose
	The purpose of this cache is to store recently requested or written data for quicker access

2.0 System Archeticture

	2.1 Overall Flow
	l1 Cache -> l2 Cache -> Store

	2.2 Cache Design
	jsCache uses Direct Mapped Cache and Associative Cache Design

	Direct Mapped
	Cache is composed of an array of Queues [Queue, Queue, Queue, ...]
	A hashing algorithim returns the index of where our Data resides

	Associative Cache
	Represented by a Queue. Data can be in any index of the Queue
	Data is found by looping through the items in the Queue and comparing the keys

3.0 Cache Behaviors

	3.1 Cache Hit
	
		Read
		If requested data is found in l1 cache, it is returned

		Write
		If cache has room, data is written in the cache but not in the store
	3.2 Cache Miss
	
		Read-Allocate
		On cache miss, check lower level caches and finally store
		Allocate data to caches

		Write-Back
		If cache has room, write data to the cache
		when data is evicted write to the store

		Eviction
		If Queue is full, dequeue first item in Queue to make room for new data

4.0 User Interface

	Instantiate a Cache and Store
	var store = new Store()
	var cache = new jsCache(cacheSetSize, setBlockSize, store, parentCache)

	Methods Available
	writeToCache(key, value)
	fetchData(key)
