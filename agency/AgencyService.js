conAngular.service('AgencyService', ['$http', '$rootScope', function($http, $rootScope){

    var service = {};
        service.getAll = getAll;
    return service;

    function getAll( callback ){
        var serviceUrl = $rootScope.apiUrl + 'agencies/';
        $http.get(serviceUrl)
           .success(function ( response ) {
                callback( response.agencies );
           })
           .error(function ( response ) {
                callback( response );
           });
    }// getAll

}]);

