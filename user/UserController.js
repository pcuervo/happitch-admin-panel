conAngular
    .controller('UserController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'UserService', 'AgencyService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTDefaultOptions', function( $scope, $rootScope, $state, $stateParams, $location, UserService, AgencyService, DTOptionsBuilder, DTColumnDefBuilder, DTDefaultOptions ){
        
        (function initController() {
            var currentPath = $location.path();
            initUsers( currentPath ); 
        })();

        /******************
        * PUBLIC FUNCTIONS
        *******************/

        $scope.captureItemData = function(){
            $scope.currentStep = CONFIRMATION_STEP;
            getItemImg();
        }      

        $scope.confirmUserRequest = function(){
            var isMemberAMAP = $('#checkbox-member-amap:checked').length;
            UserService.confirmUserRequest( $scope.user.email, $scope.agency, 2, isMemberAMAP, function ( response ){

                    if(response.errors) {
                        console.log(response.errors);
                        ErrorHelper.display( response.errors );
                        return;
                    }
                    
                    console.log( response );
                    Materialize.toast('¡Usuario registrado exitosamente!', 4000, 'green');
                    $state.go('/dashboard', {}, { reload: true });
            });
        }

        $scope.updateUser = function(){

            // Add feedback saving
            console.log('actualizando usuario...');

            var userImgName = $scope.firstName.toLowerCase() + '-' + $scope.lastName.toLowerCase() + '.' + $scope.userImgExt;
            UserService.update( $scope.id, $scope.email, $scope.firstName, $scope.lastName, $scope.userImg, userImgName, function ( response ){

                    if(response.errors) {
                        console.log(response.errors);
                        ErrorHelper.display( response.errors );
                        return;
                    }
                    console.log( response.user )
                    if( '/images/thumb/missing.png' != response.user.avatar_thumb ){
                        $('#user-avatar').attr('src', response.user.avatar_thumb );
                    }
                    Materialize.toast('¡Usuario "' + $scope.firstName + ' ' + $scope.lastName + '" actualizado exitosamente!', 4000, 'green');
                    if( '/edit-profile' === currentPath ){
                        $state.go('/my-account', {}, { reload: true });
                        return;
                    }
                    $state.go('/view-users', {}, { reload: true });
            });
        }// updateUser

        $scope.changePassword = function(){
            console.log( $scope.token );
            console.log( $scope.password );
            UserService.changePassword( $scope.token, $scope.password, function ( response ){
                if(response.errors) {
                    console.log(response.errors);
                    ErrorHelper.display( response.errors );
                    return;
                }
                Materialize.toast('¡Se ha cambiado tu contraseña!', 4000, 'green');
                // $state.go('/my-account', {}, { reload: true });
            });
        }// changePassword


        /******************
        * PRIVATE FUNCTIONS
        *******************/

        function initUsers( currentPath ){
            if( currentPath.indexOf( '/view-user-request' ) > -1 ){
                getNewUserRequest( $stateParams.requestId );
                fetchAgencies();
                return;
            }

            if( currentPath.indexOf( '/reset-password' ) > -1 ){
                $scope.token = $stateParams.passwordToken;
                return;
            }

        }

        function getAllUsers(){

            UserService.getAll( function( users ){
                $scope.users = users;
            }); 

        }// getAllUsers

        function getNewUserRequest( id ){
            UserService.getNewUserRequest( id, function( user ){
                console.log( user );
                $scope.user = user;
            }); 
        }// getUser

        function fetchAgencies(){
            AgencyService.getAll( function( agencies ){
                $scope.agencies = agencies;
            }); 
        }// fetchAgencies

        function initUsersDataTable(){
            $scope.dtUsersOptions = DTOptionsBuilder.newOptions()
                    .withPaginationType('full_numbers')
                    .withDisplayLength(10)
                    .withDOM('pit')
                    .withOption('responsive', true)
                    .withOption('order', [])
                    .withOption('searching', false);
            $scope.dtUsersColumnDefs = [
                DTColumnDefBuilder.newColumnDef(3).notSortable()
            ];
            DTDefaultOptions.setLanguageSource('https://cdn.datatables.net/plug-ins/1.10.9/i18n/Spanish.json');
        }// initUsersDataTable

    }]);