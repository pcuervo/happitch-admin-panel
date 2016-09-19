conAngular.controller('CompanyController', ['$scope', '$rootScope', '$location', '$state', 'CompanyService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTDefaultOptions', function( $scope, $rootScope, $location, $state, CompanyService, DTOptionsBuilder, DTColumnDefBuilder, DTDefaultOptions ){

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


    /*********************
    * #GENERAL FUNCTIONS
    *********************/

    function initCompany( path ){
        $scope.authToken = $rootScope.globals.currentUser.authdata;

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
                .withDisplayLength(10)
                .withDOM('itp')
                .withOption('responsive', true)
                .withOption('order', [])
                .withOption('searching', false);
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

}]);