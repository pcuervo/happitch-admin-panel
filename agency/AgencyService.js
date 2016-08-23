conAngular.service('AgencyService', ['$http', '$rootScope', function($http, $rootScope){

    var service = {};
        service.getAll = getAll;
        service.create = create;
        service.update = update;
        service.show = show;
        service.createCase = createCase;
        service.updateCase = updateCase;
        service.showCase = showCase;
        service.destroyCase = destroyCase;
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

    function create( authToken, name, phone, contactName, contactEmail, address, latitude, longitude, websiteUrl, numEmployees, goldenPitch, silverPitch, mediumPitch, highPitch, logo, filename, callback ){
        var serviceUrl = $rootScope.apiUrl + 'agencies/';
        $http.post(serviceUrl, 
            {
                auth_token: authToken,
                logo:       logo,
                filename:   filename,
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

    function update( id, authToken, name, phone, contactName, contactEmail, address, latitude, longitude, websiteUrl, numEmployees, goldenPitch, silverPitch, mediumPitch, highPitch, logo, filename, callback ){
        var serviceUrl = $rootScope.apiUrl + 'agencies/update';
        $http.post(serviceUrl, 
            {
                id: id,
                auth_token: authToken,
                logo:       logo,
                filename:   filename,
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
                    high_risk_pitch:    highPitch,
                }
            })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// update

    function createCase( authToken, agencyId, name, description, url, image, filename, callback ){
        var serviceUrl = $rootScope.apiUrl + 'success_cases/';
        $http.post(serviceUrl, 
            {
                auth_token: authToken,
                case_image: image,
                filename:   filename,
                success_case: {
                    name:           name, 
                    agency_id:      agencyId,
                    description:    description, 
                    url:            url
                }
            })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// createCase

    function updateCase( id, authToken, agencyId, name, description, url, image, filename, callback ){
        var serviceUrl = $rootScope.apiUrl + 'success_cases/update';
        $http.post(serviceUrl, 
            {
                id:         id,
                auth_token: authToken,
                case_image: image,
                filename:   filename,
                success_case: {
                    name:           name, 
                    agency_id:      agencyId,
                    description:    description, 
                    url:            url
                }
            })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// createCase

    function show( id, callback ){
        var serviceUrl = $rootScope.apiUrl + 'agencies/' + id;
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// show

    function showCase( id, callback ){
        var serviceUrl = $rootScope.apiUrl + 'success_cases/' + id;
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// show

    function destroyCase( id, authToken, callback ){
        var serviceUrl = $rootScope.apiUrl + 'success_cases/destroy';
        $http.post(serviceUrl, 
            {
                id:         id,
                auth_token: authToken
            })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// destroyCase
}]);

