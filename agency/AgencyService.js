conAngular.service('AgencyService', ['$http', '$rootScope', function($http, $rootScope){

    var service = {};
        service.getAll = getAll;
        service.create = create
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

    function create( authToken, name, phone, contactName, contactEmail, address, latitude, longitude, websiteUrl, numEmployees, goldenPitch, silverPitch, mediumPitch, highPitch, callback ){
        var serviceUrl = $rootScope.apiUrl + 'agencies/';
        $http.post(serviceUrl, 
            {
                auth_token: authToken,
                agency: {
                    name:               name, 
                    phone:              phone, 
                    contact_name:       contactName, 
                    contact_email:      contactEmail, 
                    address:            address, 
                    latitud:            latitude, 
                    longitude:          longitude, 
                    website_url:        websiteUrl, 
                    num_employees:      numEmployees, 
                    golden_pitch:       goldenPitch, 
                    silver_pitch:       silverPitch, 
                    medium_risk_pitch:  mediumPitch, 
                    high_risk_pitch:    highPitch 
                }
            })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// create

}]);

