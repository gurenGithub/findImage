var core= require('./core/index');


var sourcePath="assets/source2.png";
//var comparePath="assets/compare.jpeg,assets/compare1.jpeg,assets/compare2.jpeg,assets/compare3.jpeg,assets/compare4.jpeg,assets/compare6.jpeg";

var comparePath="assets/compare.jpeg,assets/compare1.jpeg,assets/compare2.jpeg,assets/compare3.jpeg,assets/compare4.jpeg,assets/compare6.jpeg";

let isSave=false;


if(isSave){
    core.read(sourcePath,function(image){


        console.log(image);
        
        core.crop(image,28,40,100,100);
    
        
        core.write(image,'assets/compare6.jpeg',function(res){
    
    
        })
    })
    
}else{
    core.find({source:sourcePath,compare:comparePath,onCompleted(result){


    }});
}


