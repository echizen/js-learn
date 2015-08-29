/*
 ** 特点：将所有方法定义为私有变量，不在return中定义，但是在那里暴露给用户
 ** 适用场景：它使我们更容易的了解暴露的函数。当你不在return中定义函数时，我们能轻松的了解到每一行就是一个暴露的函数，这时我们阅读代码更加轻松。
 ** 其次，你可以用简短的名字（例如 add）来暴露函数，但在定义的时候仍然可以使用冗余的定义方法（例如 incrementCount）。
 */

var jspy = (function() {
  var _count = 0;

  var incrementCount = function() {
    _count++;
  };

  var resetCount = function() {
    _count = 0;
  };

  var getCount = function() {
    return _count;
  };

  return {
    add: incrementCount,
    reset: resetCount,
    get: getCount
  };

})();