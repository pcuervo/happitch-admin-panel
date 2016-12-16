conAngular
    .controller('UserController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'UserService', 'AgencyService', 'CompanyService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTDefaultOptions', function( $scope, $rootScope, $state, $stateParams, $location, UserService, AgencyService, CompanyService, DTOptionsBuilder, DTColumnDefBuilder, DTDefaultOptions ){
        
        (function initController() {
            var currentPath = $location.path();
            initUsers( currentPath ); 
        })();

        /******************
        * PUBLIC FUNCTIONS
        *******************/

        $scope.registerUser = function(){
            var isMemberAMAP = $('#checkbox-member-amap:checked').length;
            if( 2 == $scope.role ){
                $scope.role = 3;
                $scope.agency =  $rootScope.globals.currentUser.agencyId;
            }
            UserService.registerUser( $scope.authToken, $scope.first_name, $scope.last_name, $scope.email, $scope.role, isMemberAMAP, $scope.agency, $scope.company, function ( response ){

                if(response.errors) {
                    console.log(response.errors);
                    ErrorHelper.display( response.errors );
                    return;
                }
                
                console.log( response );
                Materialize.toast('¡Usuario registrado exitosamente!', 4000, 'green');
                //$state.go('/dashboard', {}, { reload: true });
            });
        }

        $scope.confirmUserRequest = function(){
            var isMemberAMAP = $('#checkbox-member-amap:checked').length;
            UserService.confirmUserRequest( $scope.user.email, $scope.user.agency, $scope.user.company, $scope.user.user_type, isMemberAMAP, function ( response ){

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

        $scope.declineRequest = function( email ){
            UserService.rejectUserRequest( email, function ( response ){
                if(response.errors) {
                    console.log(response.errors);
                    ErrorHelper.display( response.errors );
                    return;
                }
                Materialize.toast( response.success, 4000, 'green');
                $state.go('/view-user-requests', {}, { reload: true });
            });
        }// declineRequest

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

        $scope.showAgencyCompany = function(){
            if( 2 == $scope.role || 3 == $scope.role ){
                $scope.isAgency = true;
                $scope.isCompany = false;
                return;
            }

            $scope.isAgency = false;
            $scope.isCompany = true;
        }

        $scope.getUserName = function( user ){
            if( user.first_name ) return user.first_name + ' ' + user.last_name;
            return '-';
        }

        $scope.getUserRole = function( role ){
            if( 2 == role ) return 'Administrador';
            return 'Regular';
        }


        /******************
        * PRIVATE FUNCTIONS
        *******************/

        function initUsers( currentPath ){
            $scope.authToken = $rootScope.globals.currentUser.authdata;
            $scope.role = $rootScope.globals.currentUser.role;

            if( currentPath.indexOf( '/view-user-request/' ) > -1 ){
                getNewUserRequest( $stateParams.requestId );
                fetchAgencies();
                fetchCompanies();
                return;
            }

            if( currentPath.indexOf( '/reset-password' ) > -1 ){
                $scope.token = $stateParams.passwordToken;
                return;
            }

            switch( currentPath ){
                case '/view-user-requests':
                    getAgencyUserRequests();
                    break;
                case '/add-user':
                    fetchAgencies();
                    fetchCompanies();
                    if( $scope.role == 2 ){
                        getAgency( $scope.globals.currentUser.agencyId );
                    }
                    break;
                case '/view-users':
                    if( $scope.role == 2 ){
                        fetchAgencyUsers( $scope.globals.currentUser.agencyId );
                    } else {
                        //fetchUsers();
                    }
                    break;
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

        function fetchBrands(){
            CompanyService.getBrands( function( response ){
                $scope.brands = response.brands;
            }); 
        }// fetchBrands

        function fetchCompanies(){
            CompanyService.getAll( function( response ){
                $scope.companies = response.companies;
            }); 
        }// fetchCompanies


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

        function getAgencyUserRequests(){
            UserService.getAgencyUserRequests( function( userRequests ){
                $scope.agencyUserRequests = userRequests;
            }); 
        }// getAgencyUserRequests

        function getAgency( id ){
            console.log(id);
            AgencyService.show( id, function( agency ){
                console.log( agency );
                $scope.agencyName = agency.name;
            }); 
        }

        function fetchAgencyUsers( id ){
            AgencyService.getUsers( id, function( users ){
                $scope.users = users;
            }); 
        }// fetchAgencyUsers

    }]);