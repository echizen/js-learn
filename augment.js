/* The augment function returns either a function or an object. If you define a constructor property on the prototype then it returns the constructor. Otherwise it returns the prototype
 ** module pattern：如果没有在augment内部定义this.constructor，augment会返回一个原型包括augment第一个参数下属性的实例化后的新对象
 *
 ** 如果定义了constructor，augment将返回原型指向augment第一个参数的constructor构造器
*/ 

/*
 ** 核心代码块
 */
(function (global, factory) {
    if (typeof define === "function" && define.amd) define(factory);
    else if (typeof module === "object") module.exports = factory();
    else global.augment = factory();
}(this, function () {
    "use strict";

    var Factory = function () {};
    var slice = Array.prototype.slice;

    var augment = function (base, body) {
        // 将临时函数Factory的原型指向基类base(若base是构造函数，则指向构造函数原型)
        var uber = Factory.prototype = typeof base === "function" ? base.prototype : base;
        // 直接调用时：将body中的this上挂载的属性挂到变量prototype(新建的Factory{})下
        // extend调用时：给新prototype对象添加uber属性，uber指向已建立的Factory对象。并且将extend中的body参数也就是extend要附加的属性返回给properties对象
        var prototype = new Factory, properties = body.apply(prototype, slice.call(arguments, 2).concat(uber));
        // 浅拷贝：为Factory实例获取properties获得的属性
        if (typeof properties === "object") for (var key in properties) prototype[key] = properties[key];

        // 供直接调用生成新对象
        if (!prototype.hasOwnProperty("constructor")) return prototype;

        // 供extend调用为之前生成Factory{}对象的属性上添加原型属性
        var constructor = prototype.constructor;
        // 将构造器的原型指向实例（新生成的Factory{}，并返回构造器.prototype.constructor.prototype = prototype 
        // constructor.prototype本来指向Circle.extend.constructor = { constructor: function (x, y, r),__proto__: Object}，且无限循环，从properties拷贝而来
        constructor.prototype = prototype;
        return constructor;
    };

    augment.defclass = function (prototype) {
        var constructor = prototype.constructor;
        constructor.prototype = prototype;
        return constructor;
    };


    // prototypal inheritance return: 
    // Factory = {
    //      area: function(),
    //      init: function(x, y, r),
    //      uber: Factory = {
    //          __proto__: Object = {
    //              create: function(),
    //              is: function(object),
    //          }
    //      }
    //      __proto__: Factory
    // }

    augment.extend = function (base, body) {
        return augment(base, function (uber) {
            // 为了从body.apply(prototype, slice.call(arguments, 2).concat(uber))中获取uber参数，uber为之前augment生成的Factory实例。
            // return: Factory{ uber: Factory }
            this.uber = uber;

            // prototypal inheritance return: 
            // Object = {
            //      area: function(),
            //      init: function(x, y, r),
            //      __proto__: Object
            // }
            return body;
        });
    };

    return augment;
}));



/*
 ** 应用实例
 */


/*
 ** Base use
 ** augment返回拥有完整prototype属性的构造函数，用于创建实例。
 */

var extend = augment.extend;

// return：Shape = Factory = {
//      Circle : function (x, y, r){ ... },
//      Rectangle : function (x1, y1, x2, y2) { ... },
//      __proto__ : Object{}
// }
// 
// Shape.Circle.prototype = Factory = {
//      area: ...,
//      constructor: function (x, y, r){...},
//      uber: Factory   //与Shape指向的Factory相同
// }
var Shape = augment(Object, function () {
    this.Circle = extend(this, {
        constructor: function (x, y, r) {
            this.x = x;
            this.y = y;
            this.r = r;
        },
        area: function () {
            return Math.PI * this.r * this.r;
        }
    });

    this.Rectangle = extend(this, {
        constructor: function (x1, y1, x2, y2) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        },
        area: function () {
            return Math.abs((this.x2 - this.x1) * (this.y2 - this.y1));
        }
    });
});

var circle = new Shape.Circle(0, 0, 10);
var rectangle = new Shape.Rectangle(0, 0, 8, 6);

// console.log(Shape.isPrototypeOf(circle));          // true
// console.log(circle instanceof Shape.Circle);       // true
// console.log(circle.area());                        // 314.1592653589793

// console.log(Shape.isPrototypeOf(rectangle));       // true
// console.log(rectangle instanceof Shape.Rectangle); // true
// console.log(rectangle.area()); 


/*
 ** Classical Inheritance
 */
var defclass = augment.defclass;

//  return: function constructor() {
//      this.argc = arguments.length;
//      this.argv = arguments;
//      this.listeners = [];
//  }
//  
//  constructor.prototype ={
//      addListener: function(f){...},
//      constructor: function(){...},
//      emit: function(emit){...},
//      filter: function(f){...},
//      map: function(f){...},
//      merge: function(that){...},
//      scan: function(a,f){...},
//      __proto__: Object
//  }
   
var EventStream = defclass({
    constructor: function () {
        this.argc = arguments.length;
        this.argv = arguments;
        this.listeners = [];
    },
    emit: function (event) {
        var listeners = this.listeners, length = listeners.length, index = 0;
        while (index < length) listeners[index++](event);
        this.argc = 0;
    },
    addListener: function (f) {
        var argc = this.argc, argv = this.argv, index = 0;
        while (index < argc) f(argv[index++]);
        this.listeners.push(f);
    },
    map: function (f) {
        var events = new Events;

        this.addListener(function (x) {
            events.emit(f(x));
        });

        return events;
    },
    filter: function (f) {
        var events = new Events;

        this.addListener(function (x) {
            if (f(x)) events.emit(x);
        });

        return events;
    },
    scan: function (a, f) {
        var events = new Events(a);

        this.addListener(function (x) {
            events.emit(a = f(a, x));
        });

        return events;
    },
    merge: function (that) {
        var events = new Events;

        this.addListener(function (x) {
            events.emit({ left: x });
        });

        that.addListener(function (y) {
            events.emit({ right: y });
        });

        return events;
    }
});


//  return : TimerStream = function (interval) {
//      uber.constructor.call(this);
//      this.interval = interval;
//  };
//  
//  TimerStream.prototype = Factory = {
//      constructor: function(interval){},
//      start: function(){},
//      stop: function(){},
//      __proto__: {
//          addListener: (f),
//          constructor: (),
//          emit: (event),
//          filter: (f),
//          map: (f),
//          merge: (that),
//          scan: (a, f),
//          __proto__: Object
//      }
//  }
// 
//  uber 变量因为闭包的关系而保存下来了 
//  uber = {
//      addListener: (f),
//      constructor: (),
//      emit: (event),
//      filter: (f),
//      map: (f),
//      merge: (that),
//      scan: (a, f),
//      __proto__: Object
//  }

var TimerStream = augment(EventStream, function (uber) {
    this.constructor = function (interval) {
        uber.constructor.call(this);
        this.interval = interval;
    };

    this.start = function () {
        var self = this, now = Date.now();

        self.timeout = setTimeout(function () {
            loop.call(self, now);
        }, 0);

        return now;
    };

    this.stop = function () {
        clearTimeout(this.timeout);
        return Date.now();
    };

    function loop(time) {
        var self = this, now = Date.now(), next = time + self.interval;

        self.timeout = setTimeout(function () {
            loop.call(self, next);
        }, next - now);

        // self.set(now);
    }
});

var clock = new TimerStream(3000);
// clock.start();
// clock.stop();


/*
  ** prototypal inheritance
  ** 将instance下的属性直接放到factory()原型上，然后通过实例化factory让实例对象获得instance下的属性
  ** augment结果直接返回拥有完整原型链的对象。
 */
var instance = {
    is: function (object) {
        return object.isPrototypeOf(this);
    },

    // return:  Factory = {
    //      x1: 0,
    //      x2: 8
    //      y1: 0,
    //      y2: 6
    // }
    create: function () {
        return augment(this, constructor, arguments);
    }
};

function constructor(args, base) {
    base.init.apply(this, args);
}

var extend = augment.extend;

// return: shape = Factory = {
//      circle: {
//          area: function(),
//          init: function(x, y, r),
//          uber: Factory = {
//              circle: Factory = {...},
//              rectangle: Factory = {...},
//              __proto__: Object = {
//                  is: function(object){...},
//                  create: function(){...}
//              }
//          },
//          __proto__: Factory { ... same to up}
//      },
//      rectangle: {
//          area: function(),
//          init: function(x1, y1, x2, y2),
//          uber: Factory = {
//              circle: Factory = {...},
//              rectangle: Factory = {...},
//              __proto__: Object = {
//                  is: function(object){...},
//                  create: function(){...}
//              }
//          },
//          __proto__: Factory { ... same to up}
//      }

// }
var shape = augment(instance, function () {
    this.circle = extend(this, {
        init: function (x, y, r) {
            this.x = x;
            this.y = y;
            this.r = r;
        },
        area: function () {
            return Math.PI * this.r * this.r;
        }
    });

    this.rectangle = extend(this, {
        init: function (x1, y1, x2, y2) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        },
        area: function () {
            return Math.abs((this.x2 - this.x1) * (this.y2 - this.y1));
        }
    });
});

var circle = shape.circle.create(0, 0, 10);
var rectangle = shape.rectangle.create(0, 0, 8, 6);

// console.log(circle.is(shape));              // true
// console.log(circle.is(shape.circle));       // true
// console.log(circle.area());                 // 314.1592653589793

// console.log(rectangle.is(shape));           // true
// console.log(rectangle.is(shape.rectangle)); // true
// console.log(rectangle.area());              // 48.0



/*
 ** singleton instances
 */
var MySingleton = augment(Object, function () {
    this.version = "static";

    this.getInstance = function (options) {
        var instance = augment(this, init, options);

        this.getInstance = function () {
            return instance;
        };
    };

    function init(options) {
        // do some customization using options

        var secret  = options.secret;
        this.public = options.public;

        // do some resource intensive initializations
        // like opening database connections

        this.doSomething = function () {
            // do something interesting
        };
    }
});

if (MySingleton.version === "1.0.0") {
    console.log("First major release.");
}

var mySingletonInstance = MySingleton.getInstance({
    secret: false,
    public: true
});

mySingletonInstance.doSomething();

console.log(MySingleton.getInstance() === mySingletonInstance); // true
console.log(mySingleton.isPrototypeOf(mySingletonInstance));    // true