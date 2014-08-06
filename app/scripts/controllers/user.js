'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cmsAppApp
 */
angular
	.module('cmsAppApp')
	.controller('UserManageCtrl', ['$scope', 'userResource', 'metaResource', 'notifierService', '$modal',
		function($scope, userResource, metaResource, notifierService, $modal) {
			// find users from cmsUsers collection
			userResource.query({}, function(users) {
				$scope.users = users
			});
			
			// open add user or edit user modal
			$scope.open = function(size, user) {
				var modalInstance = $modal.open({
					templateUrl: 'addUserModal.html',
					controller: addUserCtrl,
					size: size,
					resolve: {
						users: function() {
							return $scope.users;
						},
						user: function() {
							return user;
						}
					}
				});
			};
			// frozen a user, change status to 2
			$scope.frozen = function(user) {
				user.status = 2;
				user.$update().then(function(){
					notifierService.notify({
						type: 'success',
						msg: '冻结用户成功！'
					})
				}).catch(function(res) {
					notifierService.notify({
						type: 'success',
						msg: '冻结用户失败！'
					})
				})
			}
		}
	]);
var addUserCtrl = function ($scope, $modalInstance, userResource, metaResource, notifierService, users, user){
	$scope.users = users;
	$scope.user = user || {};
	$scope.userroles = [];
	// get all roles from meta collection
	metaResource.query({
		criteria: {
			type: 'role'
		}
	}, function(roles) {
		roles.forEach(function(item) {
			if (user && user.roles.indexOf(item.value)>=0) {
				$scope.userroles.push({
					name: item.value,
					isnot: true
				})
			} else {
				$scope.userroles.push({
					name: item.value,
					isnot: false
				})
			}
		})
	})
	// add a new user to database
	$scope.save = function(user) {
		var rolesArray = [];
		$scope.userroles.forEach(function(item) {
			if(item.isnot){
				rolesArray.push(item.name);
			}
		})
		$scope.user.roles = rolesArray;
		if(user._id){
			user.$update().then(function (user) {
				notifierService.notify({
					type: 'success',
					msg: '更新用户成功！'
				})
				$modalInstance.close();
			}).catch(function (res) {
				notifierService.notify({
					type: 'danger',
					msg: '更新用户失败！错误码' + res.status
				})
			})
		} else {
			userResource.save(user, function (item) {
				notifierService.notify({
					type: 'success',
					msg: '新用户保存成功！'
				})
				$scope.users.unshift(user);
				$modalInstance.close();
			})
		}
	}

	$scope.cancel = function() {
		$modalInstance.close();
	}
}