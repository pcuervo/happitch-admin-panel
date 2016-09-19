conAngular.service('PitchService', ['$http', '$rootScope', function($http, $rootScope){

    var service = {};
        service.getAll = getAll;
        service.show = show;
        service.create = create;
        service.byBrand = byBrand;
        service.createEvaluation = createEvaluation;
    return service;

    function getAll( callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitches/';
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// getAll

    function show( id, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitches/' + id;
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// show

    function create( authToken, name, brandId, briefDate, briefEmailContact, skillCategories, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitches/';
        $http.post(serviceUrl, 
            {
                auth_token:         authToken,
                skill_categories:   skillCategories,
                pitch: {
                    name:                   name,
                    brand_id:               brandId,
                    brief_email_contact:    briefEmailContact,
                    brief_date:             briefDate 
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

    function byBrand( id, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitches/by_brand/' + id;
        $http.get(serviceUrl)
        .success(function ( response ) {
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// byBrand

    function createEvaluation( authToken, pitchId, objectivesClear, selectionCriteria, budgetKnown, timeToPresent, numberAgencies, deliverablesClear, marketingInvolved, timeKnowDecision, copyright, numberRounds, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitch_evaluations/';
        $http.post(serviceUrl, 
            {
                auth_token:         authToken,
                pitch_evaluation: {
                    pitch_id:                       pitchId,
                    has_selection_criteria:         selectionCriteria,
                    are_objectives_clear:           objectivesClear,
                    time_to_present:                timeToPresent,
                    is_budget_known:                budgetKnown,
                    number_of_agencies:             numberAgencies,
                    are_deliverables_clear:         deliverablesClear,
                    is_marketing_involved:          marketingInvolved,
                    time_to_know_decision:          timeKnowDecision,
                    deliver_copyright_for_pitching: copyright,
                    number_of_rounds:               numberRounds
                }
            })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// createEvaluation

}]);

