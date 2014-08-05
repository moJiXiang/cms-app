var app = angular.module('cmsAppApp');

app.factory('cmspublicfn', ['$location', '$anchorScroll', function ($location, $anchorScroll) {
	return {
		scrollTo : function(id) {
			$location.hash(id);
			$anchorScroll();
		}
	}
}]);