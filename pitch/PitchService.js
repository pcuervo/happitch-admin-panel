conAngular.service('PitchService', ['$http', '$rootScope', function($http, $rootScope){

    var service = {};
        service.getAll = getAll;
        service.show = show;
        service.create = create;
        service.byBrand = byBrand;
        service.createEvaluation = createEvaluation;
        service.updateEvaluation = updateEvaluation;
        service.byUser = byUser;
        service.merge = merge;
        service.cancel = cancel;
        service.decline = decline;
        service.archive = archive;
        service.destroyEvaluation = destroyEvaluation;
        service.getStats = getStats;
        service.removeEvaluation = removeEvaluation;
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

    function updateEvaluation( authToken, id, pitchId, objectivesClear, selectionCriteria, budgetKnown, timeToPresent, numberAgencies, deliverablesClear, marketingInvolved, timeKnowDecision, copyright, numberRounds, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitch_evaluations/update';
        $http.post(serviceUrl, 
            {
                auth_token:  authToken,
                id:          id,
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
    }// updateEvaluation

    function byUser( authToken, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitch_evaluations/by_user';
        $http.post(serviceUrl, 
            {
                auth_token: authToken
            })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// byUser

    function merge( authToken, goodPitchId, badPitchId, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitches/merge';
        $http.post(serviceUrl, 
            {
                auth_token:     authToken,
                good_pitch_id:  goodPitchId,
                bad_pitch_id:   badPitchId
            })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// merge

    function cancel( id, authToken, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitch_evaluations/cancel';
        $http.post(serviceUrl, 
            {
                auth_token: authToken,
                id:         id
            })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// cancel

    function decline( id, authToken, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitch_evaluations/decline';
        $http.post(serviceUrl, 
            {
                auth_token: authToken,
                id:         id
            })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// decline

    function archive( id, authToken, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitch_evaluations/archive';
        $http.post(serviceUrl, 
            {
                auth_token: authToken,
                id:         id
            })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// archive

    function destroyEvaluation( id, authToken, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitch_evaluations/destroy';
        $http.post(serviceUrl, 
            {
                auth_token: authToken,
                id:         id
            })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// destroyEvaluation

    function removeEvaluation( authToken, id, reason, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitches/remove_evaluation';
        $http.post(serviceUrl, 
            {
                auth_token:     authToken,
                evaluation_id:  id,
                reason:         reason
            })
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// removeEvaluation

    function getStats( id, callback ){
        var serviceUrl = $rootScope.apiUrl + 'pitches/stats/'+id;
        $http.get(serviceUrl)
        .success(function ( response ) {
            console.log( response );
            callback( response );
        })
        .error(function ( response ) {
            callback( response );
        });
    }// getAll
}]);

