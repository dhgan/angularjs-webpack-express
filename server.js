var childProcess = require('child_process');
var spawn = childProcess.spawn;
var exec = childProcess.exec;
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var ENV = process.env.ENV

var devPort = 8888,
	serverPort = 8000;

var env = Object.create(process.env);
env.PORT = serverPort;
env.DEBUG = "tour";

var ls = spawn('node', ['./bin/www'], {
	env: env
});

ls.stdout.on('data', (data) => {
  console.log(`${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`${data}`);
});

ls.on('close', (code) => {
  console.log(`子进程退出码：${code}`);
});


// 开发环境
if(ENV == 'dev') {
	var proxy= {
		"*": "http://localhost:" + serverPort
	};

	config.entry.unshift("webpack-dev-server/client?http://localhost:"+ devPort, "webpack/hot/dev-server");
	config.plugins.push(new webpack.HotModuleReplacementPlugin());

	//启动服务
	var app = new WebpackDevServer(webpack(config), {
		hot: true,
		proxy: proxy,
		compress: true,
		stats: {
			colors: true
		}
	});

	app.listen(devPort, function() {
		console.log('dev server on http://127.0.0.1:'+ devPort);
	})
} else {
	var cmdStr = 'webpack';
	exec(cmdStr, function(err, stdout, stderr) {
		if(err) {
			console.error(err);
		} else {
			console.log(stdout);
		}
	});

}