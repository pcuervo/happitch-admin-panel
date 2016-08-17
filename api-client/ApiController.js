conAngular
    .controller('ApiController', ['$scope', '$rootScope', '$location', '$state', 'UserService', 'AgencyService', 'AuthenticationService', function( $scope, $rootScope, $location, $state, UserService, AgencyService, AuthenticationService ){

        (function initController() {
            initApi();
            $scope.apiUrl = $rootScope.apiUrl;
            $scope.apiKey = $rootScope.apiKey;
        })();

        $scope.newUserRequest = function( action ){
            console.log( action );
            switch( action ){
                case 'create':
                    createNewUserRequest( this.cnur.email, this.cnur.agency, this.cnur.userType );
                    break;
                case 'confirm':
                    confirmRequest( this.confirmReq.email, this.confirmReq.agencyId, this.confirmReq.role, this.confirmReq.isMemberAMAP );
                    break;
                case 'reject':
                    rejectRequest( this.rejectReq.email );
                    break;
            }
        }// newUserRequest

        $scope.agencyService = function( action ){
            switch( action ){
                case 'create':
                    var goldenPitch = $('#checkbox-golden-pitch:checked').length;
                    var silverPitch = $('#checkbox-silver-pitch:checked').length;
                    var mediumRiskPitch = $('#checkbox-medium-risk-pitch:checked').length;
                    var highRiskPitch = $('#checkbox-high-risk-pitch:checked').length;
                    createAgency( this.createAgency.authToken, this.createAgency.name, this.createAgency.phone, this.createAgency.contactName, this.createAgency.contactEmail, this.createAgency.address, this.createAgency.latitude, this.createAgency.longitude, this.createAgency.websiteUrl, this.createAgency.numEmployees, goldenPitch, silverPitch, mediumRiskPitch, highRiskPitch );
                    break;
                case 'update':
                    confirmRequest( this.confirmReq.email, this.confirmReq.agencyId, this.confirmReq.role, this.confirmReq.isMemberAMAP );
                    break;
            }
        }// agencies

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
                case 'agencies':
                    $scope.isAgencies = true;
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
                        Materialize.toast('Request could not be confirmed!', 4000, 'red');
                        return;
                    }
                    Materialize.toast('User request confirmed! A new user has been created.', 4000, 'green');
            });
        }

        function rejectRequest( email ){
            UserService.rejectUserRequest( email, function ( response ){
                    $scope.showUserRequestResponse = true;
                    $scope.response = response;
                    if(response.errors) {
                        Materialize.toast('Request could not be confirmed!', 4000, 'red');
                        return;
                    }
                    Materialize.toast('User request rejected! An email has been sent to user with the details abouth the rejection', 6000, 'green');
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

        function createAgency( authToken, name, phone, contactName, contactEmail, address, latitude, longitude, websiteUrl, numEmployees, goldenPitch, silverPitch, mediumPitch, highPitch ){
            AgencyService.create( authToken, name, phone, contactName, contactEmail, address, latitude, longitude, websiteUrl, numEmployees, goldenPitch, silverPitch, mediumPitch, highPitch, function ( response ){
                $scope.showAgenciesResponse = true;
                $scope.agencyResponse = response;
                if(response.errors) {
                    Materialize.toast('Agency could not be created!', 4000, 'red');
                    return;
                }
                Materialize.toast('Agency created!', 4000, 'green');
            });
        }// createAgency

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