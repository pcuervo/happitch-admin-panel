conAngular.service('AuthenticationService', ['$http', '$cookies', '$rootScope', function($http, $cookies, $rootScope){

    var service = {};
        service.login = login;
        service.logout = logout;
        service.setCredentials = setCredentials;
        service.clearCredentials = clearCredentials;

    return service;

    function login(email, password, callback) {
        if( 'test' == $rootScope.globals.env )
            $http.defaults.headers.common['Authorization'] = 'Token d2d6279345763f64ce21183142e974b8'; 
        else
            $http.defaults.headers.common['Authorization'] = 'Token 40e97aa81c2be2de4b99f1c243bec9c4'; 
 
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
            $http.defaults.headers.common.Authorization = 'Basic ';

        }

    function logout( authToken ){
        var serviceUrl = $rootScope.apiUrl  + 'sessions/destroy/';
        $http.post(serviceUrl,  { id: authToken })
           .success(function (response) {
                console.log(response);
           })
           .error(function (response) {
                ErrorHelper.display( response.errors );
           });
    }

}]);
