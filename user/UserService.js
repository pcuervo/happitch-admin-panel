conAngular
    .service('UserService', ['$http', '$rootScope', function($http, $rootScope){

        var service = {};

        service.getNewUserRequests      = getNewUserRequests;
        service.getNewUserRequest = getNewUserRequest;
        service.confirmUserRequest = confirmUserRequest;
        service.createNewUserRequest = createNewUserRequest;
        service.changePassword = changePassword;
        return service;


        function getNewUserRequests( callback ){
            var serviceUrl = $rootScope.apiUrl + 'new_user_requests/';
            $http.get(serviceUrl)
               .success(function ( response ) {
                    console.log( response );
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

        function confirmUserRequest( email, agencyId, role, isMemberAMAP, callback ){
            var serviceUrl = $rootScope.apiUrl + 'new_user_requests/confirm_request';
            $http.post(serviceUrl, 
                {
                    email:          email,
                    agency_id:      agencyId,
                    is_member_amap: isMemberAMAP,
                    role:           role
                })
               .success(function ( response ) {
                    console.log( response );
                    callback( response );
               })
               .error(function ( response ) {
                    console.log( response );
                    callback( response );
               });

        }// confirmUserRequest

        function createNewUserRequest( email, agencyName, userType, callback ){
            var serviceUrl = $rootScope.apiUrl + 'new_user_requests/';
            $http.post(serviceUrl, 
                {
                    new_user_request: {
                        email:      email, 
                        agency:     agencyName,
                        user_type:  userType
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

    }]);

