'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
  .controller('CityListCtrl', function ($scope, $http) {

    


	

	/**
  	 *  pagination 
	 */
	$scope.totalItems = 64;
	$scope.currentPage = 4;

	$scope.setPage = function(pageNo) {
		$scope.currentPage = pageNo;
	};

	$scope.pageChanged = function() {
		console.log('Page changed to: ' + $scope.currentPage);
	};

	$scope.maxSize = 5;
	$scope.bigTotalItems = 175;
	$scope.bigCurrentPage = 1;

	/**
	 *	del one city
	 */
	$scope.del = function(cityId) {
		$http.delete('/rest/citys/'+cityId).success(function(data) {
			console.log(data);
		})
	}
	// $('#searchcity').typeahead({
	// 	source: function(query, process) {
	// 		$.ajax({
	// 			url: '/mirage/index.php?it=barservice&op=get-receiptno',
	// 			type: 'POST',
	// 			dataType: 'JSON',
	// 			data: query,
	// 			success: function(data) {
	// 				console.log(data);
	// 				process(data);
	// 			}
	// 		});
	// 	}
	// })

$http.get('/rest/citys').success(function(data) {
		console.log(data);
		$scope.cities = data.items;
	})
	/**
	 *  get city datas from server
	 */
	// $scope.filterOptions = {
	// 	filterText: "",
	// 	useExternalFilter: true
	// };
	// $scope.totalServerItems = 0;
	// $scope.pagingOptions = {
	// 	pageSizes: [5, 10, 20],
	// 	pageSize: 5,
	// 	currentPage: 1
	// };
	// $scope.setPagingData = function(data, page, pageSize){
	// 	var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
	// 	$scope.myData = pagedData;
	// 	$scope.totalServerItems = data.length;
	// 	if(!$scope.$$phase) {
	// 		$scope.$apply();
	// 	}
	// }
	// $scope.getPagedDataAsync = function (pageSize, page, searchText) {
	// 	setTimeout(function() {
	// 		var data;
	// 		if (searchText) {
	// 			var ft = searchText.toLowerCase();
	// 			$http.get('largeLoad.json').success(function (largeLoad) {
	// 				data = largeLoad.filter(function(item) {
	// 					return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
	// 				});
	// 				$scope.setPagingData(data, page, pageSize);
	// 			});
	// 		} else {
	// 			$http.get('largeLoad.json').success(function (largeLoad) {
	// 				$scope.setPagingData(largeLoad, page, pageSize);
	// 			})
	// 		}
	// 	})
	// }

	// $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

	// $scope.$watch('pagingOptions', function (newVal, oldVal) {
	// 	if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
	// 		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
	// 	}
	// }, true);

	// $scope.$watch('filterOptions', function (newVal, oldVal) {
	// 	if (newVal !== oldVal) {
	// 		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
	// 	}
	// }, true);
	// $scope.myData = [{
	// 	name: "Moroni",
	// 	age: 50
	// }, {
	// 	name: "Tiancum",
	// 	age: 43
	// }, {
	// 	name: "Jacob",
	// 	age: 27
	// }, {
	// 	name: "Nephi",
	// 	age: 29
	// }, {
	// 	name: "Enos",
	// 	age: 34
	// }];
	// $scope.gridOptions = {
	// 	data: 'myData',
	// 	columnDefs: [{
	// 		field: 'name',
	// 		displayName: 'Name'
	// 	}, {
	// 		field: 'age',
	// 		displayName: 'Age'
	// 	}]
	// };

		// $scope.alerts = [{
		// 	type: 'danger',
		// 	msg: 'Oh snap! Change a few things up and try submitting again.'
		// }, {
		// 	type: 'success',
		// 	msg: 'Well done! You successfully read this important alert message.'
		// }];

		// $scope.addAlert = function() {
		// 	$scope.alerts.push({
		// 		msg: 'Another alert!'
		// 	});
		// };

		// $scope.closeAlert = function(index) {
		// 	$scope.alerts.splice(index, 1);
		// };

  })
  .controller('CityDetailCtrl', function($scope, $http, $routeParams, $location, $anchorScroll) {
  	/**
	 *  scroll to anchor
  	 */
  	$scope.scrollTo = function(id){
    	$location.hash(id);
    	$anchorScroll();
    }
  	$http.get('/rest/citys/'+ $routeParams.cityId).success(function(data) {
		console.log(data) ;
		$scope.city = data;
		var hotflag = data.hot_flag;
		var showflag = data.show_flag;
		$scope.hot_flag = hotflag == '1' ? '是' : '否';
		$scope.show_flag = showflag	== '1' ? '是' : '否';
  	})
  	/**
	 * slide city images
	 */
	$scope.myInterval = 5000;
  })
  .controller('CityEditCtrl', function($scope, $http, $routeParams) {
  	$http.get('/rest/citys/' + $routeParams.cityId).success(function(data) {
  		$scope.city = data;
  	})
  });
