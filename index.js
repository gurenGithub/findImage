var core= require('./core/index');


var sourcePath="assets/source2.jpeg";
var comparePath="assets/compare.jpeg";
/*
core.read(sourcePath,function(image){


    console.log(image);
    
    core.crop(image,30,34,100,100);

    
    core.write(image,'assets/compare.jpeg',function(res){


    })
})

*/
core.find(sourcePath,comparePath);