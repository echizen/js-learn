"use strict";
// 将来Javascript的新版本会引入"块级作用域"。为了与新版本接轨，严格模式只允许在全局作用域或函数作用域的顶层声明函数。也就是说，不允许在非函数的代码块内声明函数。函数声明无法嵌套在语句或块中。 它们只能显示在顶级或直接显示在函数体中。
// 但是下面的代码在chrome、safari下依旧打印“inside”。chrome、safari尚未对该条实施执行
function myfun(){
  console.log('outside');
};

(function(){
  if(true){
    function myfun(){
      console.log('inside');
    }
  }

  myfun();//outside
})()

// var myfun = function(){
//   console.log('outside');
// };

// (function(){
//   if(false){
//     var myfun = function(){
//       console.log('inside');
//     }
//   }

//   // myfun();
//   // console.log(myfun);//undefined
// })()
// 

// 附：分号的作用。js会自动在语句后面加分号，但是对于{}、()这种不会在后面加分号。
// // 人生第一次感受到分号的重要性，这样会报错undefined is not a function
// var myfun = function(){
//   console.log('outside');
// }
// 
// (function(){
// })()

// 上面的代码会被当做以下的形式执行。

// var myfun = function(){
//   console.log('outside');
// }(function(){
// })()