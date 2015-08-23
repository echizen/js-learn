// js中setTimeout行为
// myArray = ["zero", "one", "two"];
// myArray.myMethod = function (sProperty) {
//     alert(arguments.length > 0 ? this[sProperty] : this);
// };

// myArray.myMethod(); // prints "zero,one,two"
// myArray.myMethod(1); // prints "one"
// setTimeout(myArray.myMethod, 1000); // prints "[object Window]" after 1 second
// setTimeout(myArray.myMethod, 1500, "1"); // prints "undefined" after 1,5 seconds
// // let's try to pass the 'this' object
// setTimeout.call(myArray, myArray.myMethod, 2000); // error: "NS_ERROR_XPC_BAD_OP_ON_WN_PROTO: Illegal operation on WrappedNative prototype object"
// setTimeout.call(myArray, myArray.myMethod, 2500, 2); // same error
 
// 由setTimeout()调用的代码运行在与所在函数完全分离的执行环境上. 这会导致,这些代码中包含的 this 关键字会指向 window (或全局)对象,这和所期望的this的值是不一样的
// 解决this全局指向问题和IE不支持函数参数的问题
// Enable the passage of the 'this' object through the JavaScript timers

var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;
 
window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeST__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};
 
window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeSI__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};

/*
  test:
  myArray = ["zero", "one", "two"];
  myArray.myMethod = function (sProperty) {
      alert(arguments.length > 0 ? this[sProperty] : this);
  };

  setTimeout(alert, 1500, "Hello world!"); // the standard use of setTimeout and setInterval is preserved, but...
  setTimeout.call(myArray, myArray.myMethod, 2000); // prints "zero,one,two" after 2 seconds
  setTimeout.call(myArray, myArray.myMethod, 2500, 2); // prints "two" after 2,5 seconds
 */