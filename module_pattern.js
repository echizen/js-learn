/* 模块模式
 ** 特点：保护私有，开放接口
 */

var MODULE = (function () {
  // 私有
  var basket = [];

  function doSomethingPrivate(){
    // ...
  }

  function doSomethingElsePrivate(){
    // ...
  }

  return {
    addItem: function(values){
      basket.push(values);
    },

    getItemCount: function(){
      return basket.length;
    },

    doSomething: doSomethingPrivate,

    getTotal: function(){
      var itemCount = this.getItemCount(),
          total = 0;
      while(itemCount--){
        total += basket[itemCount].price;
      }
      return total;
    }
  };
})();

// 松耦合扩充：模块模式的一个限制是整个模块必须在一个文件里。任何人都了解长代码分割到不同文件的必要。还好，我们有很好的办法扩充模块。（在扩充文件）首先我们引入模块（从全局），给他添加属性，再输出他。提升JavaScript应用性能最好的操作就是异步加载脚本。因而我们可以创建灵活多部分的模块，可以将他们无顺序加载，以松耦合扩充

var MODULE = (function (my) {
    // add capabilities...
    my.moduleMethod = function(){
        console.log('old moduleMethod');
    }

    return my;
}(MODULE || {}));


// 紧耦合扩充：虽然松耦合很不错，但模块上也有些限制。最重要的，你不能安全的覆写模块属性（因为没有加载顺序）。初始化时也无法使用其他文件定义的模块属性（但你可以在初始化后运行）。紧耦合扩充意味着一组加载顺序，但是允许覆写。我们覆写的MODULE.moduleMethod，但依旧保持着私有内部状态。
var MODULE = (function (my) {
    var old_moduleMethod = my.moduleMethod;
     
    my.moduleMethod = function () {
        // method override, has access to old through old_moduleMethod...
    };
     
    return my;
}(MODULE || {}));


// 克隆和继承：这种方式也许最不灵活。他可以实现巧妙的组合，但是牺牲了灵活性。正如我写的，对象的属性或方法不是拷贝，而是一个对象的两个引用。修改一个会影响其他。这可能可以保持递归克隆对象的属性固定，但无法固定方法，除了带eval的方法。不过，我已经完整的包含了模块。（其实就是做了一次浅拷贝）。
var MODULE_TWO = (function (old) {
    var my = {},
        key;
     
    for (key in old) {
        if (old.hasOwnProperty(key)) {
            my[key] = old[key];
        }
    }
     
    var super_moduleMethod = old.moduleMethod;
    my.moduleMethod = function () {
        // override method on the clone, access to super through super_moduleMethod
    };
     
    return my;
}(MODULE));


// 跨文件私有状态：一个模块分割成几个文件有一个严重缺陷。每个文件都有自身的私有状态，且无权访问别的文件的私有状态。这可以修复的。
// 任何文件都可以在本地的变量_private中设置属性，他会对别的扩充立即生效（即初始化时所有扩充的私有状态都保存在_private变量，并被my._private输出）。模块完全加载了，应用调用MODULE._seal()方法阻止对私有属性的读取（干掉my._private输出)。如果此后模块又需要扩充，带有一个私有方法。加载扩充文件前调用MODULE._unseal()方法（恢复my._private，外部恢复操作权限）。加载后调用再seal()。
var MODULE = (function (my) {
    var _private = my._private = my._private || {},
        _seal = my._seal = my._seal || function () {
            delete my._private;
            delete my._seal;
            delete my._unseal;
        },//模块加载后，调用以移除对_private的访问权限
        _unseal = my._unseal = my._unseal || function () {
            my._private = _private;
            my._seal = _seal;
            my._unseal = _unseal;
        };//模块加载前，开启对_private的访问，以实现扩充部分对私有内容的操作
     
    // permanent access to _private, _seal, and _unseal
     
    return my;
}(MODULE || {}));

