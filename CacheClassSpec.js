describe("JSCacheClass", function() {

  describe('FixedArrayFunction', function() {
    var testArray;
    beforeEach(function() {
      testArray = new FixedArray(10)
    })

    it('should exist', function() {
      expect(testArray).to.be.an('object')
    })
    it('should have a write method', function() {
      testArray.write(0, 'abc')
      testArray.write(1, 'cde')
      expect(testArray.read(0)).to.equal('abc')
      expect(testArray.read(1)).to.equal('cde')
    })
    it('should have a read method', function() {
      expect(testArray).to.be.equal('object')
    })
    it('should have a modify method', function() {
      expect(testArray).to.be.equal('object')
    })


  })

})

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