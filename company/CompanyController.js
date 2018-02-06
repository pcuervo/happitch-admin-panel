conAngular.controller('CompanyController', ['$scope', '$rootScope', '$location', '$state',  '$stateParams', 'CompanyService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTDefaultOptions', function( $scope, $rootScope, $location, $state, $stateParams, CompanyService, DTOptionsBuilder, DTColumnDefBuilder, DTDefaultOptions ){

    (function initController() {
        var currentPath = $location.path();
        initCompany( currentPath );
    })();

    $scope.createCompany = function(){
        CompanyService.create( $scope.authToken, $scope.name, function ( response ){
            if(response.errors) {
                console.log( response.errors );
                ErrorHelper.display( response.errors );
                return;
            }
            Materialize.toast('¡Se ha creado la compañía "' + $scope.name + '"!', 4000, 'green');
            $state.go('/view-companies', {}, { reload: true });
        });
    }// createCompany

    $scope.createBrand = function(){
        CompanyService.createBrand( $scope.authToken, $scope.name, $scope.contactName, $scope.contactEmail, $scope.contactPosition, $scope.company, function ( response ){
            if(response.errors) {
                ErrorHelper.display( response.errors );
                return;
            }
            Materialize.toast('¡Se ha creado la marca "' + $scope.name + '"!', 4000, 'green');
            $state.go('/view-companies', {}, { reload: true });
        });
    }// createBrand


    $scope.displayBrands = function( brandsArr ){
        if( 0 == brandsArr.length ) return '-';

        var brands = '';
        for (var i = 0; i < brandsArr.length; i++) {
            brands += brandsArr[i].name + ', ';
        }
        return brands.slice( 0, -2 );
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

    $scope.unifyCompany = function( companyId ){
        if( 'undefined' === typeof $scope.incorrectCompany ) {
            Materialize.toast('Por favor selecciona un anunciante.', 4000, 'red');
            return;
        }

        CompanyService.unifyCompany( $scope.auth_token, companyId, $scope.incorrectCompany, function( companyResponse ){
            Materialize.toast('Se unificaron los anunciantes correctamente. ' + companyResponse.name + ' ahora cuenta con ' + companyResponse.brands.length + ' marcas.' , 6000, 'green');
            $state.go('/view-companies', {}, { reload: true });
        });
    }

    $scope.unifyBrand = function( companyId ){
        if( 'undefined' === typeof $scope.incorrectBrand ) {
            Materialize.toast('Por favor selecciona una marca.', 4000, 'red');
            return;
        }

        CompanyService.unifyBrand( $scope.auth_token, companyId, $scope.incorrectBrand, function( brandResponse ){
            var pitchesStr = 'pitches';
            if( 1 == brandResponse.pitches.length ) pitchesStr = 'pitch'.
            Materialize.toast('Se unificaron las marcas correctamente. ' + brandResponse.name + ' ahora cuenta con ' + brandResponse.pitches.length + ' ' + pitchesStr + '.' , 6000, 'green');
            $state.go('/view-brands', {}, { reload: true });
        });
    }

    /*********************
    * #GENERAL FUNCTIONS
    *********************/

    function initCompany( path ){
        $scope.authToken = $rootScope.globals.currentUser.authdata;

        if( path.indexOf( '/view-company/' ) > -1 ){
            getCompany( $stateParams.companyId );
            getCompanyPitches( $stateParams.companyId );

            CompanyService.dashboardSummary( $scope.auth_token, $stateParams.companyId, function( stats ){
                // $scope.users = stats.users;
                $scope.happitch = stats.happitch;
                $scope.happy = stats.happy;
                $scope.ok = stats.ok;
                $scope.unhappy = stats.unhappy;
                $scope.recommendations = stats.recommendations;
                initChartPitchesByType( stats.happitch, stats.happy, stats.ok, stats.unhappy );
                // LoaderHelper.hideLoader();
                console.log( stats );
            });
            initBrandsDataTable();
            initPitchesDataTable();
            return;
        }

        if( path.indexOf( '/unify-company/' ) > -1 ){
            LoaderHelper.showLoader('Obteniendo anunciantes...');
            fetchCompanies();
            getCompany( $stateParams.companyId );
            return;
        }

        if( path.indexOf( '/unify-brand/' ) > -1 ){
            LoaderHelper.showLoader('Obteniendo marcas...');
            fetchBrands();
            getBrand( $stateParams.brandId );
            return;
        }

        switch( path ){
            case '/view-companies':
                LoaderHelper.showLoader('Obteniendo anunciantes...');
                fetchCompanies();
                initCompanyDataTable();
                break;
            case '/view-brands':
                LoaderHelper.showLoader('Obteniendo marcas...');
                fetchBrands();
                //initSkillDataTable();
                break;
            case '/create-brand':
                fetchCompanies();
                break;
        }

    }

    function initCompanyDataTable(){
        $scope.dtCompanyOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(25)
                .withDOM('fitp')
                .withOption('responsive', true)
                .withOption('order', [])
                .withOption('searching', true);
        DTDefaultOptions.setLanguageSource('https://cdn.datatables.net/plug-ins/1.10.9/i18n/Spanish.json');
    }// initCompanyDataTable

    function initSkillDataTable(){
        $scope.dtSkillOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(10)
                .withDOM('itp')
                .withOption('responsive', true)
                .withOption('order', [])
                .withOption('searching', false);
        DTDefaultOptions.setLanguageSource('https://cdn.datatables.net/plug-ins/1.10.9/i18n/Spanish.json');
    }// initSkillDataTable

    /*********************
    * #CRUD 
    *********************/

    function getCompany( id ){
        CompanyService.show( id, function( company ){
            console.log( company );
            $scope.company = company;
        }); 
    }// getCompany

    function getCompanies(){
        CompanyService.getAll( function ( response ){
            $scope.showCompaniesResponse = true;
            $scope.companyResponse = response;
            if(response.errors) {
                Materialize.toast('Companies could not be fetched!', 4000, 'red');
                return;
            }
            Materialize.toast('Companies fetched successfully!', 4000, 'green');
        });
    }// getCompanies

    function showCompany( id ){
        CompanyService.show( id, function ( response ){
            $scope.showCompaniesResponse = true;
            $scope.companyResponse = response;
            if(response.errors) {
                Materialize.toast('Company could not be fetched!', 4000, 'red');
                return;
            }
            Materialize.toast('Company fetched successfully!', 4000, 'green');
        });
    }// showCompany

    function createCompany( authToken,  name ){
        CompanyService.create( authToken, name, function ( response ){
            $scope.showCompaniesResponse = true;
            $scope.companyResponse = response;
            if(response.errors) {
                console.log( response.errors );
                Materialize.toast('Company could not be created!', 4000, 'red');
                return;
            }
            Materialize.toast('Company created!', 4000, 'green');
        });
    }// createCompany

    function getBrands(){
        CompanyService.getBrands( function ( response ){
            $scope.showCompaniesResponse = true;
            $scope.companyResponse = response;
            if(response.errors) {
                Materialize.toast('Brands could not be fetched!', 4000, 'red');
                return;
            }
            Materialize.toast('Brands fetched successfully!', 4000, 'green');
        });
    }// getBrands

    function showBrand( id ){
        CompanyService.showBrand( id, function ( response ){
            $scope.showCompaniesResponse = true;
            $scope.companyResponse = response;
            if(response.errors) {
                Materialize.toast('Brand could not be fetched!', 4000, 'red');
                return;
            }
            Materialize.toast('Brand fetched successfully!', 4000, 'green');
        });
    }// showBrand

    function getBrand( id ){
        CompanyService.showBrand( id, function ( response ){
            console.log( response );
            $scope.brand = response;
        });
    }// showBrand

    function createBrand( authToken, name, contactName, contactEmail, contactPosition, companyId ){
        CompanyService.createBrand( authToken, name, contactName, contactEmail, contactPosition, companyId, function ( response ){
            $scope.showCompaniesResponse = true;
            $scope.companyResponse = response;
            if(response.errors) {
                Materialize.toast('Brand could not be created!', 4000, 'red');
                return;
            }
            Materialize.toast('Brand created!', 4000, 'green');
        });
    }// createBrand

    function getCompanyPitches( id ){
        CompanyService.getPitches( $scope.authToken, id, function( pitches ){
            console.log(pitches);
            $scope.pitches = pitches;
        }); 
    }// getCompanyPitches

    /*********************
     HELPER FUNCTIONS
    *********************/

    function fetchCompanies(){
        CompanyService.getAll( function( response ){
            LoaderHelper.hideLoader();
            $scope.companies = response.companies;
        }); 
    }// fetchCompanies

    function fetchBrands(){
        CompanyService.getBrands( function ( response ){
            $scope.brands = response.brands;
            LoaderHelper.hideLoader();
        });
    }// fetchBrands

    function initBrandsDataTable(){
        $scope.dtBrandsOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(25)
                .withDOM('t')
                .withOption('responsive', true)
                .withOption('order', [])
                .withOption('searching', false);
        DTDefaultOptions.setLanguageSource('https://cdn.datatables.net/plug-ins/1.10.9/i18n/Spanish.json');
    }// initBrandsDataTable

    function initPitchesDataTable(){
        $scope.dtPitchesOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(25)
                .withDOM('t')
                .withOption('responsive', true)
                .withOption('order', [])
                .withOption('searching', false);
        $scope.dtPitchesColumnDefs = [
                DTColumnDefBuilder.newColumnDef(4).notSortable()
            ];
        DTDefaultOptions.setLanguageSource('https://cdn.datatables.net/plug-ins/1.10.9/i18n/Spanish.json');
    }// initPitchesDataTable

    function initChartPitchesByType( happitch, happy, ok, unhappy ){

        $scope.lostVsWonData = [];
        $scope.lostVsWonData.push( { label: "Happitch", data: happitch, color: "#EA8543" } );
        $scope.lostVsWonData.push( { label: "Happy", data: happy, color: "#126692" } );
        $scope.lostVsWonData.push( { label: "Unhappy", data: ok, color: "#EB12B5" } );
        $scope.lostVsWonData.push( { label: "Bad Pitch", data: unhappy, color: "#FD1A2A" } );
        
        $scope.lostVsWonOpts = {
            series: {
                pie: {
                    show: true
                }
            },
            grid: {
                hoverable: true
            },
            legend: {
                backgroundOpacity: 0,
                labelBoxBorderColor: "#fff"
            },
            tooltip: true,
            tooltipOpts: {
                content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                shifts: {
                    x: 20,
                    y: 0
                },
                defaultTheme: false
            }
        };
    }// initChartPitchesByType

}]);