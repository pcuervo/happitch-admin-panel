conAngular.controller('PitchController', ['$scope', '$rootScope', '$location', '$state', '$stateParams', 'PitchService', 'CompanyService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTDefaultOptions', function( $scope, $rootScope, $location, $state, $stateParams, PitchService, CompanyService, DTOptionsBuilder, DTColumnDefBuilder, DTDefaultOptions ){

    (function initController() {
        var currentPath = $location.path();
        initPitch( currentPath );
    })();

    $scope.comparePitches = function(){
        var selectedPitches = getSelectedPitches();
        console.log( selectedPitches );
        if( 2 != selectedPitches.length ){
            Materialize.toast('Debes seleccionar exactamente 2 pitches para compararlos', 4000, 'red');
            return;
        }

        $state.go('/compare-pitches', { 'pitches' : selectedPitches }, { reload: true });
    }

    $scope.displaySkillCategories = function( skillCatArr ){
        if( 'undefined' == typeof skillCatArr ) return '-';
        if( 0 == skillCatArr.length ) return '-';

        var categories = '';
        for (var i = 0; i < skillCatArr.length; i++) {
            categories += skillCatArr[i].name + ', ';
        }
        return categories.slice( 0, -2 );
    }

    $scope.mergePitches = function(){
        var goodPitch = $('input[type="radio"]:checked').val();
        if( 1 == goodPitch ){
            var goodPitchId = $scope.pitch1.id; 
            var badPitchId = $scope.pitch2.id; 
        } else {
            var goodPitchId = $scope.pitch2.id; 
            var badPitchId = $scope.pitch1.id; 
        }
        PitchService.merge( $scope.authToken, goodPitchId, badPitchId, function( response ){
            Materialize.toast('Se han unificado los pitches correctamente.', 4000, 'green');
            $state.go('/merge-pitch-companies', {}, { reload: true });
        }); 
    }

    $scope.getRecoIcon = function( recoId ){
        var icon;
        switch( recoId ){
            case 'client_objective_25':
            case 'client_objective_50':
                icon = 'communication';
                break;
            case 'client_objective_75':
                icon = 'list';
                break;
            case 'client_budget_25':
            case 'client_budget_50':
            case 'client_budget_75':
            case 'client_budget_100':
                icon = 'budget';
                break;
            case 'client_criteria':
                icon = 'criteria';
                break;
            case 'client_number_5':
                icon = 'eye';
                break;
            case 'client_number_7':
                icon = 'number';
                break;
            case 'client_time':
                icon = 'time';
                break;
            case 'client_more_time':
                icon = 'moreTime';
                break;
            case 'client_property':
                icon = 'property';
                break;
            default:
                icon = 'deliverable';
        }   
        return icon;
    }

    $scope.deleteEvaluation = function(){
        PitchService.removeEvaluation( $scope.authToken, $scope.evaluationId, $scope.reason, function( response ){
            Materialize.toast('Se ha eliminado la evaluación y se le notificó al usuario que la creo.', 4000, 'green');
            $state.go('/view-pitch', { pitchId: response.pitch_id }, { reload: true });
        }); 
    }

    /*********************
    * #GENERAL FUNCTIONS
    *********************/

    function initPitch( path ){
        $scope.authToken = $rootScope.globals.currentUser.authdata;
        
        if( path.indexOf( '/merge-pitch-brands' ) > -1 ){
            getBrand( $stateParams.brandId );
            fetchPitchesByBrand( $stateParams.brandId );
            initPitchesDataTable();
            return;
        }

        if( path.indexOf( '/compare-pitches' ) > -1 ){
            getPitchesToCompare( $stateParams.pitches );
            // getBrand( $stateParams.brandId );
            // fetchPitchesByBrand( $stateParams.brandId );
            // initPitchesDataTable();
            return;
        }

        if( path.indexOf( '/view-pitch/' ) > -1 ){
            getPitch( $stateParams.pitchId );
            getStats( $stateParams.pitchId );
            initAgencyDataTable();
            return;
        }

        if( path.indexOf( '/delete-evaluation/' ) > -1 ){
            $scope.evaluationId = $stateParams.evaluationId;
            return;
        }

        switch( path ){
            case '/merge-pitch-companies':
                fetchPitches();
                initPitchesDataTable();
                break;
            case '/view-pitches':
                LoaderHelper.showLoader('Cargando pitches...');
                fetchPitches();
                break;
        }
    }

    function initPitchesDataTable(){
        $scope.dtPitchesOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(10)
                .withDOM('itp')
                .withOption('responsive', true)
                .withOption('order', [])
                .withOption('searching', false);
        DTDefaultOptions.setLanguageSource('https://cdn.datatables.net/plug-ins/1.10.9/i18n/Spanish.json');
    }// initPitchesDataTable

    function getBrand( brandId ){
        CompanyService.showBrand( brandId, function ( brand ){
            $scope.brand = brand;
        });
    }// getBrand

    function fetchPitchesByBrand( id ){
        PitchService.byBrand( id, function ( pitches ){
            $scope.pitches = pitches;            
        });
    }// fetchPitchesByBrand

    function fetchPitches(){
        PitchService.getAll( function( response ){
            $scope.pitches = response.pitches;
            LoaderHelper.hideLoader();
        }); 
    }// fetchCompanies

    function getSelectedPitches(){
        var pitches = [];
        $.each( $(':checked'), function(i, pitch){ pitches.push( pitch.value ) });
        return pitches;
    }

    function getPitchesToCompare( pitches ){
        var pitchIds = pitches.split(',');
        PitchService.show( pitchIds[0], function ( response ){
            console.log( response );
            $scope.pitch1 = response;            
        });
        PitchService.show( pitchIds[1], function ( response ){
            console.log( response );
            $scope.pitch2 = response;            
        });
    }

    function getPitch( pitchId ){
        PitchService.show( pitchId, function ( pitch ){
            console.log( pitch );
            $scope.pitch = pitch;      
            $scope.total_evaluations = pitch.pitch_evaluations.length;      
        });
    }

    function getStats( pitchId ){
        PitchService.getStats( pitchId, function ( response ){
            $scope.stats = response.stats;

            $scope.averageImgSrc = getPitchTypeImg( $scope.stats.average_type );
            $scope.lowestImgSrc = getPitchTypeImg( $scope.stats.lowest_type );
            $scope.highestImgSrc = getPitchTypeImg( $scope.stats.highest_type );
        });
    }

    function getPitchTypeImg( pitchType ){
        switch( pitchType ){
            case 'unhappy': return 'bad_pitch';
            case 'ok': return 'unhappy';
            default: 
                return pitchType;
        }
    }

    function initAgencyDataTable(){
        $scope.dtAgencyOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(10)
                .withDOM('itp')
                .withOption('responsive', true)
                .withOption('order', [])
                .withOption('searching', false);
        DTDefaultOptions.setLanguageSource('https://cdn.datatables.net/plug-ins/1.10.9/i18n/Spanish.json');
    }// initAgencyDataTable

}]);