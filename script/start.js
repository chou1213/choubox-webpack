var process = require('child_process');
console.log('自定义参数：', process.argv);
process.exec('', function(error, stdout, stderr) {
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});
