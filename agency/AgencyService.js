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
        service.createSkillCat = createSkillCat;
        service.showSkillCat = showSkillCat;
        service.getSkillCategories = getSkillCategories;
        service.createSkill = createSkill;
        service.showSkill = showSkill;
        service.getSkills = getSkills;
        service.addSkills = addSkills;
        service.addCriteria = addCriteria;
        service.getCriteria = getCriteria;
        service.addExclusivity = addExclusivity;
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

    function createSkillCat( authToken, name, callback ){
        var serviceUrl = $rootScope.apiUrl + 'skill_categories/';
        $http.post(serviceUrl, 
        {
            auth_token: authToken,
            skill_category: {
                name: name
            }
        })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// createSkillCat

    function showSkillCat( id, callback ){
        var serviceUrl = $rootScope.apiUrl + 'skill_categories/' + id;
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// showSkillCat

    function getSkillCategories( callback ){
        var serviceUrl = $rootScope.apiUrl + 'skill_categories/';
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// getSkillCategories

    function createSkill( authToken, name, catId, callback ){
        var serviceUrl = $rootScope.apiUrl + 'skills/';
        $http.post(serviceUrl, 
        {
            auth_token: authToken,
            skill: {
                name:               name,
                skill_category_id:  catId
            }
        })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// createSkill

    function showSkill( id, callback ){
        var serviceUrl = $rootScope.apiUrl + 'skills/' + id;
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// showSkill

    function getSkills( callback ){
        var serviceUrl = $rootScope.apiUrl + 'skills/';
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response.skills );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// getSkills

    function addSkills( authToken, id, skills, callback ){
        var serviceUrl = $rootScope.apiUrl + 'agencies/add_skills';
        $http.post(serviceUrl, 
        {
            auth_token: authToken,
            id:         id,
            skills:     skills
        })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// addSkills

    function addCriteria( authToken, id, criteria, callback ){
        var serviceUrl = $rootScope.apiUrl + 'agencies/add_criteria';
        $http.post(serviceUrl, 
        {
            auth_token: authToken,
            id:         id,
            criteria:   criteria
        })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// addCriteria

    function getCriteria( callback ){
        var serviceUrl = $rootScope.apiUrl + 'criteria/';
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// getCriteria

    function addExclusivity( authToken, id, brands, callback ){
        var serviceUrl = $rootScope.apiUrl + 'agencies/add_exclusivity_brands';
        $http.post(serviceUrl, 
        {
            auth_token: authToken,
            id:         id,
            brands:     brands
        })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// addExclusivity
}]);

