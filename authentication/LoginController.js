conAngular
	.controller('LoginController', ['$scope', '$location', '$state', 'AuthenticationService', function($scope, $location, $state, AuthenticationService){
	 
		(function initController() {
	        AuthenticationService.clearCredentials();
		})();

		$scope.login = function(){

			LoaderHelper.showLoader('Iniciando sesión...');
			AuthenticationService.login($scope.email, $scope.password, function (response) {

                if( null === response ){
                    $scope.dataLoading = false;
                    Materialize.toast('No se ha podido establecer conexión con el servidor.', 4000, 'red');
                    LoaderHelper.hideLoader();
                    return;
                }

                if( response.errors ){
                    $scope.dataLoading = false;
                    ErrorHelper.display( response.errors );
                    LoaderHelper.hideLoader();
                    return;
                }

				var userObj = response;
                var userName = '';
                var agencyId = '';
                var companyId = '';
                if( userObj.first_name ) userName = userObj.first_name + ' ' + userObj.last_name;
                if( typeof userObj.agency_id != 'undefined') agencyId = userObj.agency_id;
                if( typeof userObj.company_id != 'undefined') companyId = userObj.company_id;

			    AuthenticationService.setCredentials( userObj.id, userName, $scope.email, userObj.role, userObj.auth_token, agencyId, companyId );
				$scope.logged_in = true;

				$state.go('/dashboard');
			});
		}// login

	}]);