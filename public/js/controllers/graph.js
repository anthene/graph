angular.module('graphApp', [])
	.controller('Graph', function ($scope, $http) {
		$http.get("/graphs")
			.success(function(res) {
				$scope.graphs = res;
				$scope.selectedGraph = $scope.graphs[0];
			});
	});