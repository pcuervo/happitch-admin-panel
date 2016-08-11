conAngular.service('AuthenticationService', ['$http', '$cookies', '$rootScope', function($http, $cookies, $rootScope){

    var service = {};
        service.login = login;
        service.logout = logout;
        service.setCredentials = setCredentials;
        service.clearCredentials = clearCredentials;

    return service;

    function login(email, password, callback) {
        var serviceUrl = $rootScope.apiUrl  + 'sessions/';
        $http.post(serviceUrl, { 
            user_session: {
                email: email, 
                password: password 
            }
        })
       .success(function (response) {
            callback(response);
       })
       .error(function (response) {
            callback(response);
       });
    }// login

    function setCredentials( id, name, email, role, authToken ) {

            $rootScope.globals = {
                currentUser: {
                id:             id,
                name:           name,
                    email:          email,
                    authdata:       authToken,
                role:           role,
                }
            };
 
            $cookies.putObject('globals', $rootScope.globals);
        $cookies.put('loggedIn', true);
        }
 
        function clearCredentials() {

            $rootScope.globals = {};
            $rootScope.loggedIn = false;
        
            $cookies.remove('globals');
            $cookies.put('loggedIn', false);
            //$http.defaults.headers.common.Authorization = 'Basic ';

        }

    function logout( authToken, callback ){
        var serviceUrl = $rootScope.apiUrl  + 'sessions/destroy/';
        $http.post(serviceUrl,  { id: authToken })
           .success(function (response) {
                callback( response );
           })
           .error(function (response) {
                callback( response )
           });
    }

}]);
