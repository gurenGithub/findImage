var Jimp = require('jimp');



/**
 * 获取图片属性
 * @param {*} image 
 */
const getProperties = function (image) {

    var data = image.bitmap.data; // a Buffer of the raw bitmap data
    var width = image.bitmap.width; // the width of the image
    var height = image.bitmap.height; // the height of the image


    return {
        data: data,
        width: width,
        height: height
    };
}

const write = function (image, path, callback) {

    image.write(path, function (res) {




        callback && callback(res);

    });
}
const crop = function (image, x, y, w, h) {

    image.crop(x, y, w, h);
}

const read = function (path, callback) {

    Jimp.read(path, function (err, image) {

        if (err) {
            console.log('读取图片失败', err);
        }



        !err && callback && callback(image);
    })
}

var splitStr = "_";
var isSame = function (a, b) {


    var diff = 3;
    return Math.abs(a.r - b.r) <= diff &&
        Math.abs(a.g - b.g) <= diff &&
        Math.abs(a.b - b.b) <= diff &&
        Math.abs(a.a - b.a) <= diff
}

var getKey = function (x, y) {

    return x + splitStr + y;
}
/**
 * 
 * @param {原创图片} source 
 * @param {对比图片} compare 
 * @param {开始查找坐标:x} x 
 * @param {开始查找坐标:y} y 
 * @param {结束查找坐标:x1} x1 
 * @param {结束查找坐标:y2} y2 
 */
const find = function (source, compare, x, y, x1, y1) {



    Jimp.read(source, function (err, sourceImage) {

         sourceImage.greyscale((err, sourceImage) => {
        var sourceP = getProperties(sourceImage);


        x = x || 0;
        y = y || 0;
        x1 = x1 || sourceP.width;
        y1 = y1 || sourceP.height;
        //console.log(sourceP);
        Jimp.read(compare, function (err, compareImage) {

            compareImage.greyscale((err, compareImage) => {
            var compareP = getProperties(compareImage);




            //console.log(cropImage);

            // return;


            var x2 = x1;
            var y2 = y1;

            var startX = 0;
            var endY = 0;

            var startDate = new Date();
            console.log(startDate, sourceP);


            var comparePoints = []

            var sourcePoints = {};
            var key;

            console.log(x, y);
            for (var i = x; i < x2; i++) {

                for (var j = y; j < y2; j++) {


                    var newX = i;
                    var newY = j;
                    //var cropImage=  sourceImage.crop(newX,newY,compareP.width,compareP.height);
                    // sourceImage.crop(newX,newY,compareP.width,compareP.height);

                    // var diff = Jimp.diff(sourceImage, cropImage); // pixel difference

                    var pixel = sourceImage.getPixelColor(newX, newY); // returns the colour of that pixel e.g. 0xFFFFFFFF
                    //Jimp.intToRGBA(pixel); 
                    //console.log(pixel);
                    var rgba = Jimp.intToRGBA(pixel);

                    if (!sourcePoints[i]) {
                        sourcePoints[i] = [];
                    }
                    sourcePoints[i][j] = rgba;

                    //首选先弄上下两个边rgba值是否一致


                }
            }


            for (var ci = startX; ci < compareP.width; ci += 1) {

                for (var cj = endY; cj < compareP.height; cj += 1) {


                    var comparePixel = compareImage.getPixelColor(ci, cj); // returns the colour of that pixel e.g. 0xFFFFFFFF
                    //Jimp.intToRGBA(pixel); 
                    //console.log(pixel);
                    var rgba = Jimp.intToRGBA(comparePixel);
                    if (!comparePoints[ci]) {
                        comparePoints[ci] = [];
                    }
                    comparePoints[ci][cj] = rgba;




                }


            }





            var count = 0;
            var total =0;
            var lastPoints = {};


           // x = 10, x2 = 11, y = 10, y2 = 11;
            for (var i = x; i < x2; i++) {

                for (var j = y; j < y2; j++) {






                    if (!isSame(comparePoints[0][0], sourcePoints[i][j])) {
                        //lastPoints={};
                        //isbreak = true;
                        continue;
                    }

                     total = compareP.width * compareP.height;
                    count = 0;
                    for (var ci = startX; ci < compareP.width; ci++) {


                        var isbreak = false;
                        for (var cj = endY; cj < compareP.height; cj++) {


                            var comparePoint = comparePoints[ci][cj];

                            point = sourcePoints[i + ci][j + cj];

                            //console.log(comparePoint,point,{ci:ci,cj:cj,i:i ,j:j});

                            if (!point) {

                                //lastPoints={};
                               // console.log(comparePoint, point);
                                isbreak = true;
                                break;
                            }
                            if (!isSame(comparePoint, point)) {
                                //lastPoints={};
                                /*console.log(comparePoint, point, {
                                    ci: ci,
                                    cj: cj,
                                    i: i + ci,
                                    j: j + cj
                                });*/
                                isbreak = true;
                                break;
                            }

                            count++;
                        }
                        if (isbreak) {
                            break;
                        }
                    }


                    //console.log(total, count);
                    if (count >= total) {
                      
                        total=count;
                        lastPoints = {
                            x: i,
                            y: j
                        };
                    }
                    //console.log('第一个相似坐标:'+count,{x:i,y:j});
                }

            }

            console.log('相似:' + total, lastPoints);
            var endDate = new Date();
            console.log(endDate, endDate.getTime() - startDate.getTime());
            // console.log(sourcePoints, sourcePoints);



            console.log(Jimp.intToRGBA(compareImage.getPixelColor(0, 0)), comparePoints[0][0]);
            console.log(Jimp.intToRGBA(sourceImage.getPixelColor(10, 10)), sourcePoints[10][10]);
        })

    })

    })
    })


}

module.exports = {
    find,
    crop,
    write,
    read
};