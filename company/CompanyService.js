conAngular.service('CompanyService', ['$http', '$rootScope', function($http, $rootScope){

    var service = {};
        service.getAll = getAll;
        service.show = show;
        service.create = create;
        service.getBrands = getBrands;
        service.showBrand = showBrand;
        service.createBrand = createBrand;
        service.showBrandByCompany = showBrandByCompany;
        service.dashboardSummary = dashboardSummary;
        service.dashboardAvgPerMonth = dashboardAvgPerMonth;
        service.getUsers = getUsers;
        service.getPitches = getPitches;
        service.unifyCompany = unifyCompany;
        service.unifyBrand = unifyBrand;
    return service;

    function getAll( callback ){
        var serviceUrl = $rootScope.apiUrl + 'companies/';
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// getAll

    function show( id, callback ){
        var serviceUrl = $rootScope.apiUrl + 'companies/' + id;
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// show

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

    function getBrands( callback ){
        var serviceUrl = $rootScope.apiUrl + 'brands/';
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// getBrands

    function showBrand( id, callback ){
        var serviceUrl = $rootScope.apiUrl + 'brands/' + id;
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// showBrand

    function createBrand( authToken, name, contactName, contactEmail, contactPosition, companyId, callback ){
        var serviceUrl = $rootScope.apiUrl + 'brands/';
        $http.post(serviceUrl, 
            {
                auth_token: authToken,
                brand: {
                    name:               name,
                    contact_name:       contactName,
                    contact_email:      contactEmail,
                    contact_position:   contactPosition,
                    company_id:         companyId
                }
            })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// createBrand

    function showBrandByCompany( id, callback ){
        var serviceUrl = $rootScope.apiUrl + 'brands/by_company/' + id;
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// showBrandByCompany

    function dashboardSummary( authToken, id, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitch_evaluations/dashboard_summary_by_client';
        $http.post(serviceUrl, 
        {
            auth_token: authToken,
            id: id
        })
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// dashboardSummary

    function getUsers( id, callback ){
        var serviceUrl = $rootScope.apiUrl + 'companies/get_users';
        $http.post(serviceUrl, 
        {
            id: id
        })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// getUsers

    function getPitches( authToken, id, callback ){
        var serviceUrl = $rootScope.apiUrl + 'companies/get_pitches';
        $http.post(serviceUrl, 
        {
            auth_token: authToken,
            id: id
        })
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// getPitches

    function dashboardAvgPerMonth( authToken, id, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitch_evaluations/average_per_month_by_company';
        $http.post(serviceUrl, 
        {
            auth_token: authToken,
            id: id
        })
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// dashboardAvgPerMonth

    function unifyCompany( authToken, id, incorrectCompanyId, callback ){
        var serviceUrl = $rootScope.apiUrl + 'companies/unify';
        $http.post(serviceUrl, 
            {
                auth_token:           authToken,
                id:                   id,
                incorrect_company_id: incorrectCompanyId
            })
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// createBrand

    function unifyBrand( authToken, id, incorrectBrandId, callback ){
        var serviceUrl = $rootScope.apiUrl + 'brands/unify';
        $http.post(serviceUrl, 
            {
                auth_token:           authToken,
                id:                   id,
                incorrect_brand_id: incorrectBrandId
            })
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// createBrand

}]);

