/* 工厂模式
 ** 特点：创建型模式，不显式的要求使用一个构造函数。由factory提供一个通用的接口来创建对象。
 ** 使用场景：如果对象创建过程相对比较复杂。例如强烈依赖于动态因素或应用程序配置。
 **         1.当对象或组件设置涉及高复杂性时
 **         2.当需要根据所在的不同环境轻松生成对象的不同实例时
 **         3.当处理很多共享相同属性的小型对象或组件时
 **         4.在编写只需要满足一个API契约的其他对象的实例对象时。
*/
function Car(options) {
  this.doors = options.doors || 4;
  this.state = options.state || "brand new";
  this.color = options.color || "silver";
}

function Truck(options){
  this.state = options.state || "used";
  this.wheelSize = options.wheelSize || "large";
  this.color = options.color || "blue";
}

function VehicleFactory(){}

VehicleFactory.prototype.vehicleClass = Car;

VehicleFactory.prototype.createVehicle = function(options){
  if(options.VehicleType === "car"){
    this.vehicleClass = Car;
  }else{
    this.vehicleClass = Truck;
  }

  return new this.vehicleClass(options);
};

var carFactory = new VehicleFactory();

// ===========================================

var car = carFactory.createVehicle({
  VehicleType: "car",
  color: "yellow",
  doors: 6
});

console.log(car instanceof Car);

console.log(car);
// Car {doors: 6, state: "brand new", color: "yellow"}

var movingTruck = carFactory.createVehicle({
  vehicleType:"trunk",
  state:"like new",
  color:"red",
  wheelSize:"small"
});

console.log(movingTruck instanceof Truck);

console.log(movingTruck);
// Truck {state: "like new", wheelSize: "small", color: "red"}
 

// ===========================================

function TruckFactory(){}

TruckFactory.prototype = new VehicleFactory();
TruckFactory.prototype.vehicleClass = Truck;

var truckFactory = new TruckFactory();

var myBigTruck = truckFactory.createVehicle({
  state:"omg .. so bad.",
  color:"pink",
  wheelSize: "so big"
})

console.log(myBigTruck instanceof Truck);

console.log(myBigTruck);
// Truck {state: "omg .. so bad.", wheelSize: "so big", color: "pink"}