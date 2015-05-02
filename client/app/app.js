angular.module('codeColab', [
	'codeColab.main',
	'codeColab.services',
	'ngRoute'
	])

.config(function ($routeProvider) {
	$routeProvider
		.when ('/main', {
			templateUrl : '/app/main/main.html',
			controller: 'codeCtrl'
		})
		.when('/signin', {
      templateUrl: '/app/clientAuth/signin.html'
    })	
    .when('/logout', {
      templateUrl: '/app/clientAuth/signin.html',
    	controller: 'codeCtrl'
    })
		.otherwise({
			redirectTo: '/signin'
		})
})
