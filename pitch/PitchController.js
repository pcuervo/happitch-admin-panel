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
            $state.go('/merge-pitches-companies', {}, { reload: true });
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

        switch( path ){
            case '/merge-pitch-companies':
                fetchPitches();
                initPitchesDataTable();
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
            console.log( pitches );
            $scope.pitches = pitches;            
        });
    }// fetchPitchesByBrand

    function fetchPitches(){
        PitchService.getAll( function( response ){
            console.log( response );
            $scope.pitches = response.pitches;
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

}]);