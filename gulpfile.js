/*!
* 项目打包配置0.0.1
*
* Creator: Ryu
* https://www.npmjs.com/package/
* node <= v4.2.2
*/

/*node_modules 目录*/
var nodeModules = './node_modules/';

/*备用插件列表*/
var path = require('path');
var gulp = require(nodeModules + 'gulp');

/*输助插件*/
var notify = require(nodeModules + 'gulp-notify');

/*出错终断处理补丁*/
var plumber = require(nodeModules + 'gulp-plumber');

/*本地静态服务器*/
var browserSync = require(nodeModules + 'browser-sync').create();


/*样式相关*/
var sourcemaps = require(nodeModules + 'gulp-sourcemaps');
/*前缀自动兼容*/
/*https://github.com/ai/browserslist#queries*/
var autoprefixer = require(nodeModules + 'gulp-autoprefixer');
var sass = require(nodeModules + 'gulp-sass');



/**
 * 转换./开头路径为watch路径
 * @param { Array|String } 目录路么
 * @return { Array|String } 目录列表
*/
var changeWatchPath = function(arr) {
	var tmp = [];

	if (Object.prototype.toString.call(arr) === '[object Array]') {
		for (var i = 0, len = arr.length; i < len; i++) {
			tmp.push(arr[i].toString().replace(/^\.\//, ''));
		}
		return tmp;
	} else {
		return arr;
	}
};


/**************************************
* 默认目录配置
***************************************/

/*http://segmentfault.com/a/1190000002955996*/
var assetsPath = {
	www: './',
	css: './css',
	sass: './sass',
	html: './html',
	dist: './js/build',
	dev: './js/dev',
sassFile: ['./sass/**/@(main|reset)?(_?)*.scss']
},

/*css通用配置*/
baseConfig = {
	browsers: ['safari >= 5', 'ie >= 9', 'Firefox >= 20']
},

/*用于调用事件*/
gulpfile = gulp.src('./gulpfile.js');



/*静态服务器 + 监听 css/sass/less/html 文件*/
gulp.task('server', function() {
	var sassFile = [];

	/*server 和 proxy不能同时使用, proxy默认会开启一个服务器，仅需要指向静态文件*/
	browserSync.init({
		/*首页设置*/
		startPath: 'html/dev/index.html',

		server : {
			/*服务器根目录*/
			baseDir: './',
			/*本地服务器端口*/
			port: 3000,
		},

		/*自动打开浏览器主页*/
		open: true,
		/*别人说模拟事件，好像有坑*/
		ghostMode: false,
		notify: true,
		//logLevel: 'debug',
		logConnections: true
	});

	
	

	/*'./xx' 开头作为当前路径开始，会导致无法监测到新增文件，所以直接省略掉 './' 即可*/
	//gulp.watch(['html/**/*.html']).on('change', browserSync.reload);
	gulp.watch(['html/dev/*.html']).on('change', browserSync.reload);
	gulp.watch(['css/**/*.css']).on('change', browserSync.reload);
	gulp.watch(['js/dev/**/*.js']).on('change', browserSync.reload);
	gulp.watch(['images/**/*']).on('change', browserSync.reload);

	/*更改sass任务为修改的单一文件编译*/
	gulp.watch(changeWatchPath(assetsPath.sassFile)).on('change', function(evt) {
		var file = evt.path;
		strJson = '',
		tmp = [],
		relativePath  = '';

		strJson = path.parse(file);
		tmp = strJson.dir.split(/sass/);

		if(tmp.length > 1){
			relativePath = tmp[tmp.length - 1];
		}

		/*编译sass*/
		if (evt.type == 'changed' || evt.type == 'added') {
			gulp.src(file).pipe(plumber({
				errorHandler: notify.onError({
					title: 'gulp sass error',
					message: 'Error: <%= error.message %>'
				})
			})).pipe(sourcemaps.init()).pipe(sass({
				/*outputStyle: 'expanded'*/
				outputStyle: 'compressed'
			})).pipe(autoprefixer({
				browsers: baseConfig.browsers,
				cascade: false
			})).pipe(notify({
				title: 'gulp Sass success',
				message: 'css file: <%= file.relative %> change'
			})).pipe(sourcemaps.write('./map')).pipe(gulp.dest(assetsPath.css + relativePath));
		}
		else if (evt.type == 'deleted') {
			console.log('delete：' + file);
		}
	});
});


