// Sidebar Controller
conAngular.controller('SidebarController', ['$scope', '$rootScope', 'UserService', function( $scope, $rootScope, UserService ) {

    (function initController() {

    })();

    $scope.$on('$includeContentLoaded', function() {
        conApp.initSidebar();
        $rootScope.$watch('loggedIn', function() {
            if( $rootScope.loggedIn ) {
                $scope.role = $rootScope.globals.currentUser.role;
                $scope.roleName = getRoleName( $scope.role );
            }
        });
    });

    function getRoleName( role ){
        if( 1 == role ) return 'Admin';
        if( 2 == role ) return 'Agencia';
    }

}]);