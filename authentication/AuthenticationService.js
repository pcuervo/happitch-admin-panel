conAngular.service('AuthenticationService', ['$http', '$cookies', '$rootScope', function($http, $cookies, $rootScope){

    var service = {};
        service.login = login;
        service.logout = logout;
        service.setCredentials = setCredentials;
        service.clearCredentials = clearCredentials;
        service.isLoggedIn = isLoggedIn;

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

    function isLoggedIn(token, callback) {
        var serviceUrl = $rootScope.apiUrl  + 'sessions/is_active';
        $http.post(serviceUrl, { 
            auth_token: token
        })
       .success(function (response) {
            callback(response);
       })
       .error(function (response) {
            callback(response);
       });
    }// login

    function setCredentials( id, name, email, role, authToken, agencyId, companyId ) {

        $rootScope.globals = {
            currentUser: {
                id:             id,
                name:           name,
                email:          email,
                authdata:       authToken,
                role:           role,
            }
        };
        
        if( typeof agencyId != 'undefined'){
            $rootScope.globals.currentUser['agencyId'] = agencyId;
        }
        if( typeof companyId != 'undefined'){
            $rootScope.globals.currentUser['companyId'] = companyId;
        }
 
        $cookies.putObject('globals', $rootScope.globals);
        $cookies.put('loggedIn', true);
    }
 
    function clearCredentials() {
        $rootScope.globals = {};
        $rootScope.loggedIn = false;
        $cookies.remove('globals');
        $cookies.put('loggedIn', false);
    }

    function logout( authToken ){
        var serviceUrl = $rootScope.apiUrl  + 'sessions/destroy/';
        $http.post(serviceUrl,  { id: authToken })
           .success(function (response) {
                return response;
           })
           .error(function (response) {
                console.log( response )
           });
    }

}]);
