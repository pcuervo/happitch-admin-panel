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


    /*********************
    * #GENERAL FUNCTIONS
    *********************/

    function initCompany( path ){
        $scope.authToken = $rootScope.globals.currentUser.authdata;

        if( path.indexOf( '/view-company/' ) > -1 ){
            getCompany( $stateParams.companyId );

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
            return;
        }

        switch( path ){
            case '/view-companies':
                fetchCompanies();
                initCompanyDataTable();
                break;
            case '/view-brands':
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


    /*********************
     HELPER FUNCTIONS
    *********************/

    function fetchCompanies(){
        CompanyService.getAll( function( response ){
            console.log( response );
            $scope.companies = response.companies;
        }); 
    }// fetchCompanies

    function fetchBrands(){
        CompanyService.getBrands( function ( response ){
            console.log( response );
            $scope.brands = response.brands;
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