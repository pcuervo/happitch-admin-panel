conAngular.controller('DashboardController', [ '$rootScope', '$scope', 'UserService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTDefaultOptions', function( $rootScope, $scope, UserService, DTOptionsBuilder, DTColumnDefBuilder, DTDefaultOptions ) {

    (function initController() {
        initDashboard( $scope.role ); 
    })();

    /******************
    * PUBLIC FUNCTIONS
    *******************/



    /******************
    * PRIVATE FUNCTIONS
    *******************/

    function initDashboard( role ){
        getAgencyUserRequests();
        getBrandUserRequests();
        initAgencyUserDataTable();
    }// initDashboard

    function initAgencyUserDataTable(){
        $scope.dtAgencyUserRequestsOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(20)
                .withDOM('it')
                .withOption('responsive', true)
                .withOption('order', [])
                .withOption('searching', false);
        DTDefaultOptions.setLanguageSource('https://cdn.datatables.net/plug-ins/1.10.9/i18n/Spanish.json');
    }// initAgencyUserDataTable

    function initBrandUserDataTable(){
        $scope.dtBrandUserRequestsOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(20)
                .withDOM('itp')
                .withOption('responsive', true)
                .withOption('order', [])
                .withOption('searching', false);
        DTDefaultOptions.setLanguageSource('https://cdn.datatables.net/plug-ins/1.10.9/i18n/Spanish.json');
    }// initBrandUserDataTable

    function getNewUserRequests(){
        UserService.getNewUserRequests( function( userRequests ){
            $scope.userRequests = userRequests;
        }); 
    }// getNewUserRequests

    function getAgencyUserRequests(){
        UserService.getAgencyUserRequests( function( userRequests ){
            $scope.agencyUserRequests = userRequests;
        }); 
    }// getAgencyUserRequests

    function getBrandUserRequests(){
        UserService.getBrandUserRequests( function( userRequests ){
            $scope.brandUserRequests = userRequests;
        }); 
    }// getBrandUserRequests

}]);