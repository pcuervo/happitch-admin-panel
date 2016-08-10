conAngular.controller('DashboardController', [ '$rootScope', '$scope', 'UserService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTDefaultOptions', function( $rootScope, $scope, UserService, DTOptionsBuilder, DTColumnDefBuilder, DTDefaultOptions ) {

    (function initController() {
        initDashboard( $scope.role ); 
    })();

    /******************
    * PUBLIC FUNCTIONS
    *******************/

    $scope.someFunc = function( args ){

    }// someFunc



    /******************
    * PRIVATE FUNCTIONS
    *******************/

    function initDashboard( role ){
        getNewUserRequests();
        initNewUserDataTable();
    }// initDashboard

    function initNewUserDataTable(){
        $scope.dtPendingEntryRequestsOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(20)
                .withDOM('it')
                .withOption('responsive', true)
                .withOption('order', [])
                .withOption('searching', false);
        // $scope.dtPendingEntryRequestsColumnDefs = [
        //     //DTColumnDefBuilder.newColumnDef(5).notSortable()
        // ];
        DTDefaultOptions.setLanguageSource('https://cdn.datatables.net/plug-ins/1.10.9/i18n/Spanish.json');
    }// initNewUserDataTable

    function getNewUserRequests(){
        UserService.getNewUserRequests( function( userRequests ){

            $scope.userRequests = userRequests;
        }); 
    }// getNewUserRequests

}]);