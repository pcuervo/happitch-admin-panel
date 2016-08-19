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

                    var logoFilename = '';
                    if( 'undefined' !== typeof $scope.imageExt ){
                        logoFilename = FormatHelper.slug( this.createAgency.name ) + '.' + $scope.imageExt;
                    }
                    console.log(logoFilename);
                    createAgency( this.createAgency.authToken, this.createAgency.name, this.createAgency.phone, this.createAgency.contactName, this.createAgency.contactEmail, this.createAgency.address, this.createAgency.latitude, this.createAgency.longitude, this.createAgency.websiteUrl, this.createAgency.numEmployees, goldenPitch, silverPitch, mediumRiskPitch, highRiskPitch, $scope.image, logoFilename );
                    break;
                case 'update':
                    var goldenPitch = $('#checkbox-golden-pitch:checked').length;
                    var silverPitch = $('#checkbox-silver-pitch:checked').length;
                    var mediumRiskPitch = $('#checkbox-medium-risk-pitch:checked').length;
                    var highRiskPitch = $('#checkbox-high-risk-pitch:checked').length;
                    var logoFilename = '';
                    if( 'undefined' !== typeof $scope.imageExt ){
                        logoFilename = FormatHelper.slug( this.updateAgency.name ) + '.' + $scope.imageExt;
                    }
                    updateAgency( this.updateAgency.id, this.updateAgency.authToken, this.updateAgency.name, this.updateAgency.phone, this.updateAgency.contactName, this.updateAgency.contactEmail, this.updateAgency.address, this.updateAgency.latitude, this.updateAgency.longitude, this.updateAgency.websiteUrl, this.updateAgency.numEmployees, goldenPitch, silverPitch, mediumRiskPitch, highRiskPitch, $scope.image, logoFilename );
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

        $scope.successCaseService = function( action ){
            switch( action ){
                case 'create':
                    var filename = '';
                    if( 'undefined' !== typeof $scope.imageExt ){
                        filename = FormatHelper.slug( this.createCase.name ) + '.' + $scope.imageExt;
                    }
                    createCase( this.createCase.authToken, this.createCase.agencyId, this.createCase.name, this.createCase.description, this.createCase.url, $scope.image, filename );
                    break;
                case 'update':
                    var filename = '';
                    if( 'undefined' !== typeof $scope.imageExt ){
                        filename = FormatHelper.slug( this.updateCase.name ) + '.' + $scope.imageExt;
                    }
                    updateCase( this.updateCase.id, this.updateCase.authToken, this.updateCase.agencyId, this.updateCase.name, this.updateCase.description, this.updateCase.url, $scope.image, filename );
                    break;
            }
        }// successCaseService

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
                    $("#create-agency-logo").change(function(){
                        getImgData( 'create-agency-logo' );
                    });
                    $("#update-agency-logo").change(function(){
                        getImgData( 'update-agency-logo' );
                    });
                    $("#create-success-case-image").change(function(){
                        console.log('getting');
                        getImgData( 'create-success-case-image' );
                    });
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

        function createAgency( authToken, name, phone, contactName, contactEmail, address, latitude, longitude, websiteUrl, numEmployees, goldenPitch, silverPitch, mediumPitch, highPitch, logo, logoFilename ){
            AgencyService.create( authToken, name, phone, contactName, contactEmail, address, latitude, longitude, websiteUrl, numEmployees, goldenPitch, silverPitch, mediumPitch, highPitch, logo, logoFilename, function ( response ){
                $scope.showAgenciesResponse = true;
                $scope.agencyResponse = response;
                if(response.errors) {
                    Materialize.toast('Agency could not be created!', 4000, 'red');
                    return;
                }
                Materialize.toast('Agency created!', 4000, 'green');
            });
        }// createAgency

        function updateAgency( id, authToken, name, phone, contactName, contactEmail, address, latitude, longitude, websiteUrl, numEmployees, goldenPitch, silverPitch, mediumPitch, highPitch, logo, logoFilename ){
            AgencyService.update( id, authToken, name, phone, contactName, contactEmail, address, latitude, longitude, websiteUrl, numEmployees, goldenPitch, silverPitch, mediumPitch, highPitch, logo, logoFilename, function ( response ){
                $scope.showAgenciesResponse = true;
                $scope.agencyResponse = response;
                if(response.errors) {
                    Materialize.toast('Agency could not be created!', 4000, 'red');
                    return;
                }
                Materialize.toast('Agency created!', 4000, 'green');
            });
        }// updateAgency

        function createCase( authToken, agencyId, name, description, url, image, filename  ){
            AgencyService.createCase( authToken, agencyId, name, description, url, image, filename, function ( response ){
                $scope.showAgenciesResponse = true;
                $scope.successCaseResponse = response;
                if(response.errors) {
                    console.log( response.errors );
                    Materialize.toast('Success case could not be created!', 4000, 'red');
                    return;
                }
                Materialize.toast('Success case created!', 4000, 'green');
            });
        }// createCase

        function updateCase( id, authToken, agencyId, name, description, url, image, filename  ){
            AgencyService.updateCase( id, authToken, agencyId, name, description, url, image, filename, function ( response ){
                $scope.showAgenciesResponse = true;
                $scope.successCaseResponse = response;
                if(response.errors) {
                    console.log( response.errors );
                    Materialize.toast('Success case could not be updated!', 4000, 'red');
                    return;
                }
                Materialize.toast('Success case updated!', 4000, 'green');
            });
        }// updateCase


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
            $scope.isAgencies = false;
        }

        function getImgData( id ){
            var imgId = id;
            var fileInput = document.getElementById( imgId );
            file = fileInput.files[0];
            fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = function(){
                $scope.image = fr.result;
                $scope.imageExt = file.name.split('.').pop().toLowerCase();
                console.log($scope.imageExt);
            }
        }// getItemImg

    }]);