/**
 * Created by cFrost on 2016/11/30.
 */
// 说明
var gulp = require('gulp');

gulp.task('help',function () {

    console.log('	gulp build			文件打包');

    console.log('	gulp watch			文件监控打包');

    console.log('	gulp help			gulp参数说明');

    console.log('	gulp server			测试server');

    console.log('	gulp -p				生产环境（默认生产环境）');

    console.log('	gulp -d				开发环境');

    console.log('	gulp -m <module>		部分模块打包（默认全部打包）');

});

/* 默认 */

gulp.task('default',function () {

    gulp.start('help');

});