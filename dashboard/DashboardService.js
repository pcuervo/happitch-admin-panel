conAngular.service('DashboardService', ['$http', '$rootScope', function($http, $rootScope){

    var service = {};
    service.amap = amap;
    return service;

    function amap( callback ){
        var serviceUrl = $rootScope.apiUrl + 'dashboards/amap';
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// amap

    function create( authToken, name, callback ){
        var serviceUrl = $rootScope.apiUrl + 'companies/';
        $http.post(serviceUrl, 
            {
                auth_token: authToken,
                company: {
                    name: name
                }
            })
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// create

}]);

