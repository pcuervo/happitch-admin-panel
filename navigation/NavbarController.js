// Navbar Controller
conAngular.controller('NavbarController', ['$scope', '$rootScope', '$cookies', function($scope, $rootScope, $cookies) {
    $scope.$on('$includeContentLoaded', function() {

        $rootScope.$watch('loggedIn', function() {
            if( $rootScope.loggedIn ) {
                $scope.role = $rootScope.globals.currentUser.role;
                $('#my-account span').text( $rootScope.globals.currentUser.email );
                if( '/images/thumb/missing.png' != $rootScope.globals.currentUser.avatarUrl ){
                    $('#user-avatar').attr('src', $rootScope.globals.currentUser.avatarUrl );
                }
            }
        });
    });
}]);
