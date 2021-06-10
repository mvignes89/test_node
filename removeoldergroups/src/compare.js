const config = require('./config/redis.json');
const Redis = require("ioredis");
const inputs = require('./config/input.json');
const async = require("async");

var srcCluster;
var destCluster;

function connectToRedis(config) {
    return new Redis(config);
}

function initSrc() {
    srcCluster = connectToRedis(config.source);
}



function init() {
    initSrc();
}


function eachSeries(list) {
    async.eachSeries(list, function (key, callback) {
        if(key){
            srcCluster.type(key,function(err, data){
                console.log(key,data)
                setTimeout(callback,25);
            })
        }else{
            callback();
        }
    }, function (err) {
        // if any of the file processing produced an error, err would equal that error
        if (err) {
            // One of the iterations produced an error.
            // All processing will now stop.
            console.log("Error", err)
        } else {
            console.log('All files have been processed successfully');
        }
    });
}

function main() {
    init();
    eachSeries(inputs);
}

main();