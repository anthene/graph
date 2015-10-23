angular.module('graphApp', ['ngRoute'])
	.controller('GraphController', function ($scope, $http) {
		$scope.scale = 4;
		$scope.showBrigdes = true;
		$scope.colors = ['black', 'green', 'blue'];
		$scope.selectedColor = $scope.colors[0];
		$scope.radiuses = ["1", "2", "3", "4", "5"];
		$scope.selectedRadius = $scope.radiuses[2];

		$http.get("/graphs")
			.success(function(res) {
				$scope.graphs = res;
				$scope.selectedGraph = $scope.graphs[0];
			});

		$scope.show = function() {
			$http.get("/genSvg", {
					params: {
						fileName: $scope.selectedGraph.name,
						scale: $scope.scale,
						showBrigdes: $scope.showBrigdes,
						color: $scope.selectedColor,
						radius: $scope.selectedRadius
					}
				})
				.success(function(res) {
					$scope.svg = res;
				});
		};
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