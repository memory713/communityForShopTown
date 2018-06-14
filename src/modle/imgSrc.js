    //判断图片是否存在
    function validateImage(url)
    {    
        if(url == null){
             return false;
        }else{
            var xmlHttp ;
            if (window.ActiveXObject){
              xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
             }else if (window.XMLHttpRequest){
              xmlHttp = new XMLHttpRequest();
             } 
            xmlHttp.open("HEAD",url,false);
           
            if(xmlHttp.status==404)
            return false;
            else
            return true;
        }
        
    } 
    export default validateImage
