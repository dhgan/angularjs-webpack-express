var app = require('./app.js');
//require('./commonServer.js');

// 设置angular路由
app.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {

	// 将!#弄成#
	$locationProvider.hashPrefix('');

	$stateProvider
	.state('index', {
		url: '/',
		templateUrl: '/'
	})
	.state('page1', {
		url: '/page1',
		templateUrl: './page1',
		resolve: {
			foo: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
				var deferred = $q.defer();
				require.ensure([], function() {
					var module = require('../pages/page1/page1.js');
					$ocLazyLoad.load({
						name: 'tour'
					});
					deferred.resolve(module);
				});
				return deferred.promise;
			}]
		}
	})
	.state('page2', {
		url: '/page2',
		templateUrl: './page2',
		resolve: {
			foo: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
				var deferred = $q.defer();
				require.ensure([], function() {
					var module = require('../pages/page2/page2.js');
					$ocLazyLoad.load({
						name: 'tour'
					});
					deferred.resolve(module);
				});
				return deferred.promise;
			}]
		}
	});

}]);