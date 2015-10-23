angular.module('graphApp', ['ngRoute'])
	.controller('GraphController', function ($scope, $http) {
		$http.get("/graphs")
			.success(function(res) {
				$scope.graphs = res;
				$scope.selectedGraph = $scope.graphs[0];
			});
	})
	.controller('GenerationController', function ($scope, $http) {
		$scope.vertexCount = 5;
		$scope.step = 2;

		$scope.generate = function() {
			$http.get("/petGenerate", {params: {vertexCount: $scope.vertexCount, step: $scope.step}})
				.success(function(res) {
					$scope.svg = res;
				});
		};
	})
	.config( ['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/gen', {
				controller: 'GenerationController',
				templateUrl: 'views/gen.html'
			})
			.when('/sam', {
				controller: 'GraphController',
				templateUrl: 'views/samples.html'
			})
			.otherwise({
				redirectTo: '/sam'
			});
	}]);	