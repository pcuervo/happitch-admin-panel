conAngular
    .service('UserService', ['$http', '$rootScope', function($http, $rootScope){

        var service = {};

        service.getNewUserRequests      = getNewUserRequests;
        service.getNewUserRequest       = getNewUserRequest;
        service.registerUser            = registerUser;
        service.confirmUserRequest      = confirmUserRequest;
        service.rejectUserRequest       = rejectUserRequest;
        service.createNewUserRequest    = createNewUserRequest;
        service.changePassword          = changePassword;
        service.getAgencyUserRequests   = getAgencyUserRequests;
        service.getBrandUserRequests    = getBrandUserRequests;
        service.getAll                  = getAll;
        service.getAdminUsers           = getAdminUsers;
        return service;


        function getNewUserRequests( callback ){
            var serviceUrl = $rootScope.apiUrl + 'new_user_requests/';
            $http.get(serviceUrl)
               .success(function ( response ) {
                    callback( response );
               })
               .error(function ( response ) {
                    callback( response );
               });
        }// getNewUserRequests

        function getNewUserRequest( id, callback ){
            var serviceUrl = $rootScope.apiUrl + 'new_user_requests/' + id;
            $http.get(serviceUrl)
               .success(function ( response ) {
                    callback( response );
               })
               .error(function ( response ) {
                    callback( response );
               });
        }// getNewUserRequest

        function confirmUserRequest( email, agencyId, companyId, role, isMemberAMAP, callback ){
            var serviceUrl = $rootScope.apiUrl + 'new_user_requests/confirm_request';
            $http.post(serviceUrl, 
            {
                email:          email,
                agency_id:      agencyId,
                company_id:     companyId,
                is_member_amap: isMemberAMAP,
                role:           role
            })
           .success(function ( response ) {
                callback( response );
           })
           .error(function ( response ) {
                callback( response );
           });

        }// confirmUserRequest

        function registerUser( authToken, firstName, lastName, email, role, isMemberAMAP, agencyId, companyId, callback ){
            var serviceUrl = $rootScope.apiUrl + 'users/';
            $http.post(serviceUrl, 
            {
                auth_token: authToken,
                agency_id:      agencyId,
                company_id:     companyId,
                user: {
                    first_name:     firstName,
                    last_name:      lastName,
                    email:          email,
                    is_member_amap: isMemberAMAP,
                    role:           role
                }
    
            })
           .success(function ( response ) {
                callback( response );
           })
           .error(function ( response ) {
                callback( response );
           });

        }// registerUser

        function rejectUserRequest( email, callback ){
            var serviceUrl = $rootScope.apiUrl + 'new_user_requests/reject_request';
            $http.post(serviceUrl, 
                {
                    email: email
                })
               .success(function ( response ) {
                    callback( response );
               })
               .error(function ( response ) {
                    callback( response );
               });

        }// rejectUserRequest

        function createNewUserRequest( email, agencyBrand, userType, callback ){
            var serviceUrl = $rootScope.apiUrl + 'new_user_requests/';
            $http.post(serviceUrl, 
                {
                    new_user_request: {
                        email:          email, 
                        agency_brand:   agencyBrand,
                        user_type:      userType
                    }
                })
               .success(function ( response ) {
                    callback( response );
               })
               .error(function ( response ) {
                    callback( response );
               });

        }// createNewUserRequest

        function changePassword( token, password, callback ){
            var serviceUrl = $rootScope.apiUrl + 'users/reset_password';
            $http.post(serviceUrl, 
            {
                token: token,
                password: password,
            })
           .success(function ( response ) {
                console.log( response )
                callback( response );
           })
           .error(function ( response ) {
                callback( response );
           });
        }// changePassword

        function getAgencyUserRequests( callback ){
            var serviceUrl = $rootScope.apiUrl + 'new_user_requests/agency_users';
            $http.get(serviceUrl)
               .success(function ( response ) {
                    callback( response );
               })
               .error(function ( response ) {
                    callback( response );
               });
        }// getAgencyUserRequests

        function getBrandUserRequests( callback ){
            var serviceUrl = $rootScope.apiUrl + 'new_user_requests/brand_users';
            $http.get(serviceUrl)
               .success(function ( response ) {

                    callback( response );
               })
               .error(function ( response ) {
                    callback( response );
               });
        }// getBrandUserRequests

        function getAll( callback ){
            var serviceUrl = $rootScope.apiUrl + 'users';
            $http.get(serviceUrl)
               .success(function ( response ) {
                    callback( response );
               })
               .error(function ( response ) {
                    callback( response );
               });
        }// getAll

        function getAdminUsers( callback ){
            var serviceUrl = $rootScope.apiUrl + 'users/admin';
            $http.get(serviceUrl)
               .success(function ( response ) {
                    callback( response );
               })
               .error(function ( response ) {
                    callback( response );
               });
        }// getAdminUsers

    }]);

