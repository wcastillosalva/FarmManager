/**
*  Welcome to your gulpfile!
*  The gulp tasks are splitted in several files in the gulp directory
*  because putting all here was really too long
*/

'use strict';

var gulp = require('gulp');
var wrench = require('wrench');
/**
*  This will load all js or coffee files in the gulp directory
*  in order to load all gulp tasks
*/
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});


/**
*  Default task clean temporaries directories and launch the
*  main optimization build task
*/
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

gulp.task('build-prod',['clean'],function(){
  gulp.start('build').on('end', function(){ gulp.start('generate-service-worker-dist') });
});
gulp.task('generate-swdev', function(callback) {
  writeServiceWorkerFile('src', callback);
});

gulp.task('generate-swdist', function(callback) {
  writeServiceWorkerFile('dist', callback);
});

function writeServiceWorkerFile(rootDir, callback){
  var path = require('path');
  var swPrecache = require('sw-precache');
  var staticFile = rootDir=='dist' ? [rootDir + '/**/*.{js,html,css,png,jpg,jpeg,gif,json,svg,eot,ttf,woff,ico}*']:[];
  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    staticFileGlobs: staticFile,
    stripPrefix: rootDir,
    runtimeCaching:[{
      urlPattern:/https:\/\/api\.darksky\.net\/forecast/,
      handler : rootDir=='dist' ? 'networkFirst':'fastest'
    },{
      urlPattern: /https:\/\/www.gstatic.com\/firebasejs\/.*\/firebase-.*\.js/,
      handler : 'cacheFirst'
    },{
      urlPattern: /https:\/\/.*\.firebaseio\.com\/applications\/.*\/farms\.json/,
      handler : rootDir=='dist' ? 'networkFirst' : 'fastest'
    },{
      urlPattern:/https:\/\/.*\.firebaseio\.com\/applications\/.*\/farms\/.*\.json/,
      handler : rootDir=='dist' ? 'networkFirst':'fastest'
    },{
      urlPattern:/https:\/\/.*\.firebaseio\.com\/applications\/.*\/animalTypes\.json/,
      handler : rootDir=='dist' ? 'networkFirst':'fastest'
    },{
      urlPattern:/https:\/\/.*\.firebaseio\.com\/applications\/.*\/animalSubTypes\.json/,
      handler : rootDir=='dist' ? 'networkFirst':'fastest'
    },{
      urlPattern:/https:\/\/.*\.firebaseio\.com\/applications\/.*\/plantTypes\.json/,
      handler : rootDir=='dist' ? 'networkFirst':'fastest'
    },{
        urlPattern: /https:\/\/.*\.firebaseio\.com\/applications\/.*\/animals\.json/,
      handler : rootDir=='dist' ? 'networkFirst':'fastest'
    },{
        urlPattern: /https:\/\/.*\.firebaseio\.com\/applications\/.*\/plants\.json/,
      handler : rootDir=='dist' ? 'networkFirst':'fastest'
    },{
      urlPattern:/https:\/\/fonts\.googleapis\.com\/css\?*/,
      handler : rootDir=='dist' ? 'networkFirst':'fastest'
    }]
  }, callback);
}
