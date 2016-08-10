conAngular
    .controller('ApiController', ['$scope', '$location', '$state', 'UserService', 'AgencyService', function( $scope, $location, $state, UserService, AgencyService ){
     
        (function initController() {
            // reset login status
            initApi();
        })();

        $scope.newUserRequest = function( action ){
            switch( action ){
                case 'create':
                    createNewUserRequest( this.cnur.email, this.cnur.agency, this.cnur.userType );
                    break;
                case 'confirm':
                    confirmRequest( this.confirmReq.email, this.confirmReq.agencyId, this.confirmReq.role, this.confirmReq.isMemberAMAP );
                    break;
            }
        }// updateUser

        $scope.setActive = function( tab ){
            //setInactiveAll();
            switch( tab ){
                case 'isNewUserRequests':
                    $scope.isNewUserRequests = true;
                    break;
            }
        }// updateUser

        function initApi(){
            $('ul.tabs').tabs();
            $scope.isNewUserRequests = true;
            $scope.testApiUrl  = 'http://localhost:3000/api/';
            $scope.devApiUrl = 'https://amap-dev.herokuapp.com/api/';
            $scope.prodApiUrl  = 'https://amap-prod.herokuapp.com/api/'
            $scope.testApiKey  = 'd2d6279345763f64ce21183142e974b8';
            fetchAgencies();
        }

        function createNewUserRequest( email, agencyName, userType ){
            UserService.createNewUserRequest( email, agencyName, userType, function ( response ){
                    $scope.showUserRequestResponse = true;
                    $scope.response = response;
                    if(response.errors) {
                        console.log(response.errors);
                        Materialize.toast('New user request could not be created!', 4000, 'red');
                        return;
                    }
                    Materialize.toast('New user request created!', 4000, 'green');
            });
        }

        function confirmRequest( email, agencyId, role, isMemberAMAP ){
            UserService.confirmUserRequest( email, agencyId, role, isMemberAMAP, function ( response ){
                    $scope.showUserRequestResponse = true;
                    $scope.response = response;
                    if(response.errors) {
                        console.log(response.errors);
                        Materialize.toast('Request could not be confirmed!', 4000, 'red');
                        return;
                    }
                    Materialize.toast('User request confirmed! A new user has been created.', 4000, 'green');
            });
        }

        function fetchAgencies(){
            AgencyService.getAll( function( agencies ){
                $scope.agencies = agencies;
            }); 
        }// fetchAgencies

    }]);