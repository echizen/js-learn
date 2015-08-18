var url = 'https://echizen.github.io';

function getXMLHttpRequest(){
  if(window.XMLHttpRequest){
    return new window.XMLHttpRequest;
  }else{
    try{
      return new ActiveXObject('MSXML2.XMLHTTP.3.0');
    }catch(ex){
      return null;
    }
  }
}

var xhr = getXMLHttpRequest();

if(xhr!=null){
  /* void open(
     DOMString method,
     DOMString url,
     optional boolean async,
     optional DOMString user,
     optional DOMString password
  ); */
  // get
  xhr.open('GET',url);
  xhr.send();
  // post
  // var form = document.getElementById('form');
  // var formData = new FormData(form);
  // formData.append('useId',userId);
  // xhr.open('POST'.url);
  // xhr.send(formData);
  xhr.timeout = 3000;
  xhr.ontimeout = function(){
    console.log('连接超时');
  }
  xhr.onReadyStateChange = function() {
    if(xhr.readyState == 4 && xhr.status == 200){
      console.log(xhr.responseText);
    }else{
      console.log(xhr.statusText);
    }
  }
}else{
  console.log('你的浏览器版本不支持ajax');
}