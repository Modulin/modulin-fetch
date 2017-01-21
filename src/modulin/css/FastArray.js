/**
 * When using arrays with more than ~70 000 entries, some implementations of V8 are unable to properly optimize array.shift
 * This custom implementation uses internal cursors to handle shifts, pushes and pops
 *
 * @param array target array to wrap
 * @constructor
 */
export default FastArray;

function FastArray(array) {
  this.array = array;
  this.startCursor = 0;
  this.endCursor = array.length;
}

FastArray.prototype.shift = function shift() {
  if (this.isAtEnd()) {
    debugger;
    throw "End of match not found";
  }

  var previous = this.first();
  this.startCursor++;
  return previous;
};

FastArray.prototype.push = function push(item) {
  this.array[this.endCursor] = item;
  this.endCursor++;
};

FastArray.prototype.pop = function pop() {
  var item = this.last();
  this.endCursor--;
  return item;
};

FastArray.prototype.first = function current() {
  return this.array[this.startCursor];
};

FastArray.prototype.last = function current() {
  return this.array[this.endCursor - 1];
};

FastArray.prototype.isAtEnd = function isAtEnd() {
  return this.length() <= 0;
};

FastArray.prototype.length = function length() {
  return this.endCursor - this.startCursor;
};

FastArray.prototype.reverse = function reverse() {
  let length = this.length() / 2;
  let end = this.endCursor - 1;
  var array = this.array;
  for (let i = this.startCursor; i < length; i++) {
    [array[i], array[end - i]] = [array[end - i], array[i]];
  }
  return this;
};

FastArray.prototype.getArray = function getArray() {
  return this.array.slice(this.startCursor, this.endCursor);
};

FastArray.prototype.get = function getArray(index) {
  return this.array[this.startCursor + index];
};
