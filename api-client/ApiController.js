conAngular
    .controller('ApiController', ['$scope', '$location', '$state', 'UserService', 'AgencyService', 'AuthenticationService', function( $scope, $location, $state, UserService, AgencyService, AuthenticationService ){

        (function initController() {
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

        $scope.sessions = function( action ){
            switch( action ){
                case 'login':
                    loginUser( this.sessions.email, this.sessions.password );
                    break;
                case 'logout':
                    logoutUser( this.sessions.authorizationToken );
                    break;
            }
        }

        $scope.setActive = function( tab ){
            setCollectionInactive();
            $('#'+tab).addClass('active');
            switch( tab ){
                case 'sessions':
                    $scope.isSessions = true;
                    break;
                case 'users':
                    $scope.isUsers = true;
                    break;
                case 'newUserRequests':
                    $scope.isNewUserRequests = true;
                    break;
                default:
                    $scope.isNewUserRequests = true;
            }
        }// updateUser

        function initApi(){
            $('ul.tabs').tabs();
            $scope.isNewUserRequests = true;
            $scope.testApiUrl   = 'http://localhost:3000/api/';
            $scope.devApiUrl    = 'https://amap-dev.herokuapp.com/api/';
            $scope.prodApiUrl   = 'https://amap-prod.herokuapp.com/api/'
            $scope.testApiKey   = 'd2d6279345763f64ce21183142e974b8';
            fetchAgencies();
        }

        /*********************
         API FUNCTIONS
        *********************/
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

        function loginUser( email, password ){
            AuthenticationService.login( email, password, function ( response ){
                $scope.showSessionResponse = true;
                $scope.sessionResponse = response;
                if(response.errors) {
                    console.log(response.errors);
                    Materialize.toast('Could not log in user!', 4000, 'red');
                    return;
                }
                Materialize.toast('User logged in! A new session has been created.', 4000, 'green');
            });
        }

        function logoutUser( token ){
            AuthenticationService.logout( token, function ( response ){
                console.log( response );
                $scope.showSessionResponse = true;
                $scope.sessionResponse = response;
                console.log( $scope.sessionResponse );
                if(response.errors) {
                    console.log(response.errors);
                    Materialize.toast('Could not log out user!', 4000, 'red');
                    return;
                }
                Materialize.toast('User logged out! The sessions has been destroyed.', 4000, 'green');
            });
        }

        /*********************
         HELPER FUNCTIONS
        *********************/
        function fetchAgencies(){
            AgencyService.getAll( function( agencies ){
                $scope.agencies = agencies;
            }); 
        }// fetchAgencies

        function setCollectionInactive(tab){
            $('.collection-item').removeClass('active');
            $scope.isNewUserRequests = false;
            $scope.isUsers = false;
            $scope.isSessions = false;
        }

    }]);