"use strict";
function getElementsByClassName(context,classname){
  if(context.getElementsByClassName){
    return context.getElementsByClassName(classname);
  }else if(context.querySelectorAll){
    return context.querySelectorAll("." + classname);
  }else{
    var results = [];
    var elems = context.getElementsByTagName("*");
    for(var i=0 ,length = elems.length; i< length; i++){
        if(typeof elems[i].className === "string"){ //为空时为""
            elems[i].className.indexOf(classname)!==-1? results[results.length] = elems[i]:"";
        }else if(typeof elems[i].getAttribute !== "undefined"){
            var selfClass = elems[i].getAttribute('class'); //为空时为null
            selfClass!==null && selfClass.indexOf(classname)!==-1? results[results.length] = elems[i]:"";
        }
    }
    return results;
  }
}