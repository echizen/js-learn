<!DOCTYPE html>
<html>
    <head>
        <title>hi js</title>
        <!-- Tell the browser to be responsive to screen width -->
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <meta http-equiv="content-type" content="text/html;charset=utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <style type="text/css">
        </style>
    </head>
    <body>
        <ul class="list">  
            <li class="list_items">000</li>  
            <li class="list_items"><a href="javascript:void(0);">111</a></li>  
            <li class="list_items"><i>222</i></li>  
            <li>333</li>  
        </ul> 
        <script type="text/javascript" >

            $('.list').on('click', '.list_items', function (e) {  
                    console.log(e.target.tagName);  //"LI" or "A" or "I"  
                    console.log(this);  //LI  
                    console.log($(this).text());  
                    console.log(this.tagName);//LI  
                });  

            var father = document.querySelectorAll('.list');

            [].forEach.call(father,function(e){
                
                e.addEventListener('click',function(ele){
                    var findParent = function(elem){
                        var parentE = elem.parentNode;
                        if(parentE.className === 'list_items'){
                            return true;
                        }else if(parentE.className === 'list'){
                            return false;
                        }
                        findParent(parentE);
                    }
                    if(ele.target.className === 'list_items' || findParent(ele.target)){
                        console.log(ele.target.tagName);  //"LI" or "A" or "I"  
                        console.log(this);  //LI  
                        console.log(ele.target.innerText);  
                        console.log(this.tagName);//LI 
                    }
                },false);
                
            })
            
        </script>
  </body>
</html>