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

var logTime=function(_startDate,title){


    var _endDate=new Date();
    console.log({
        title:title,
        //result: result,
        startDate: _startDate,
        endDate: _endDate,
        total: _endDate.getTime() - _startDate.getTime(),
    });

    return _endDate;
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
const find = function ({source, compare, x, y, x1, y1,onCompleted}) {


    let scaleDiv=2;
    let scaleParams=1/scaleDiv;
    let _startDate = new Date();
    Jimp.read(source, function (err, sourceImage) {


        var sourcePoints = [];
       _startDate= logTime(_startDate,'读取');

       sourceImage.scale(scaleParams);
        sourceImage.greyscale((err, sourceImage) => {
         _startDate=   logTime(_startDate,'置灰');
            var sourceP = getProperties(sourceImage);


           // console.log(sourceP);

            x = x || 0;
            y = y || 0;
            x1 = x1 || sourceP.width;
            y1 = y1 || sourceP.height;

            var x2 = x1;
            var y2 = y1;


            for (let i = x; i < x2; i++) {

                for (let j = y; j < y2; j++) {


                    let newX = i;
                    let newY = j;
                    //var cropImage=  sourceImage.crop(newX,newY,compareP.width,compareP.height);
                    // sourceImage.crop(newX,newY,compareP.width,compareP.height);

                    //var diff = Jimp.diff(sourceImage, cropImage); // pixel difference

                    let pixel = sourceImage.getPixelColor(newX, newY); // returns the colour of that pixel e.g. 0xFFFFFFFF
                    //Jimp.intToRGBA(pixel); 
                    //console.log(pixel);
                    let rgba = Jimp.intToRGBA(pixel);

                    if (!sourcePoints[i]) {
                        sourcePoints[i] = [];
                    }
                    sourcePoints[i][j] = rgba;

                    //首选先弄上下两个边rgba值是否一致


                }
            }


           _startDate= logTime(_startDate,'转换GRBA');
            var callback = function (compare, fn) {


                //console.log(sourceP);
                Jimp.read(compare, function (err, compareImage) {
                    compareImage.scale(scaleParams );
                    compareImage.greyscale((err, compareImage) => {
                        var compareP = getProperties(compareImage);




                        //console.log(cropImage);

                        // return;


                        var startX = 0;
                        var endY = 0;

                        var startDate = new Date();
                       // console.log(startDate, sourceP);


                        var comparePoints = []


                        var key;

                       // console.log(x, y);
                       


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
                        var total = 0;
                        var lastPoints = {
                            x: -1,
                            y: -1
                        };

                        var __width=compareP.width-1;
                        var __height=compareP.height-1;
                        // x = 10, x2 = 11, y = 10, y2 = 11;
                        for (var i = x; i < x2-__width; i++) {

                            for (var j = y; j < y2-__height; j++) {





                                

                               // break;

                                if (!isSame(comparePoints[0][0], sourcePoints[i][j])
                               ) {
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
                                            //continue;
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
                                            //continue;
                                            break;
                                        }

                                        count++;
                                    }
                                    if (isbreak) {
                                       // continue;
                                        break;
                                    }
                                }


                                //console.log(total, count);
                                if (count >= total) {

                                    total = count;
                                    lastPoints = {
                                        x: i,
                                        y: j
                                    };
                                }
                                //console.log('第一个相似坐标:'+count,{x:i,y:j});
                            }

                        }

                        //console.log('相似:' + total, lastPoints);
                        var endDate = new Date();
                        //console.log(endDate, endDate.getTime() - startDate.getTime());
                        // console.log(sourcePoints, sourcePoints);



                        //console.log(Jimp.intToRGBA(compareImage.getPixelColor(0, 0)), comparePoints[0][0]);
                        //console.log(Jimp.intToRGBA(sourceImage.getPixelColor(10, 10)), sourcePoints[10][10]);

                        if (fn) {

                            fn(lastPoints);
                        }
                    })

                })
            }



            var paths = compare.split(',');


            var path = paths.shift();
          


            // console.log(path);
            var result = [];

            var _endFn = function () {

                var _endDate = new Date();

                console.log({
                    title:'对比',
                    result: result,
                    startDate: _startDate,
                    endDate: _endDate,
                    total: _endDate.getTime() - _startDate.getTime(),
                });
                if(onCompleted){
                    onCompleted(result);
                }
            }
            var _eachFind = ((el) => {

                callback(path, function (data) {

                    if (data.x != -1) {
                        result.push(data);
                    }

                    path = paths.shift();
                    if (path) {

                        _eachFind(path);
                    } else {
                        _endFn();
                    }

                });
            })

            _eachFind(path);

        })
    })



}

module.exports = {
    find,
    crop,
    write,
    read
};