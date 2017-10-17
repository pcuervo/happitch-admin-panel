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
            console.log('registering...');
            var isMemberAMAP = $('#checkbox-member-amap:checked').length;
            if( 2 == $scope.role ){
                $scope.agency =  $rootScope.globals.currentUser.agencyId;
                $scope.currentRole = 2;
            }
            if( 4 == $scope.role ){
                $scope.company =  $rootScope.globals.currentUser.companyId;
                $scope.currentRole = 4;
            }
            UserService.registerUser( $scope.authToken, $scope.firstName, $scope.lastName, $scope.email, $scope.currentRole, isMemberAMAP, $scope.agency, $scope.company, function ( response ){

                if(response.errors) {
                    console.log(response.errors);
                    ErrorHelper.display( response.errors );
                    return;
                }
                
                console.log( response );
                Materialize.toast('¡Usuario registrado exitosamente!', 4000, 'green');
                $state.go('/view-users', {}, { reload: true });
            });
        }

        $scope.registerAdmin = function(){
            if( 2 == $scope.role ){
                $scope.agency =  $rootScope.globals.currentUser.agencyId;
            }
            UserService.registerUser( $scope.authToken, $scope.firstName, $scope.lastName, $scope.email, 1, 1, '', '', function ( response ){

                if(response.errors) {
                    console.log(response.errors);
                    ErrorHelper.display( response.errors );
                    return;
                }
                
                console.log( response );
                Materialize.toast('¡Usuario registrado exitosamente!', 4000, 'green');
                $state.go('/view-admin-users', {}, { reload: true });
            });
        }

        $scope.confirmUserRequest = function(){
            if( 2 == $scope.user_type ){
                var isMemberAMAP = $('#checkbox-member-amap:checked').length;
            } else {
                var isMemberAMAP = 1;
            }
            
            UserService.confirmUserRequest( $scope.user.email, $scope.user.agency, $scope.user.company, $scope.user.user_type, isMemberAMAP, function ( response ){

                if(response.errors) {
                    console.log(response.errors);
                    ErrorHelper.display( response.errors );
                    return;
                }
                
                console.log( response );
                Materialize.toast('¡Usuario registrado exitosamente!', 4000, 'green');
                $state.go('/view-users', {}, { reload: true });
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
            UserService.changePassword( $scope.token, $scope.password, function ( response ){
                if(response.errors) {
                    ErrorHelper.display( response.errors );
                    return;
                }
                $scope.successfulReset = true;
                Materialize.toast('¡Se ha cambiado tu contraseña!', 4000, 'green');
            });
        }// changePassword

        $scope.showAgencyCompany = function(){
            if( 2 == $scope.currentRole || 3 == $scope.currentRole ){
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
            switch( role ){
                case 1: return 'Administrador';
                case 2: 
                case 3: return 'Agencia';
                case 4: 
                case 5: return 'Anunciante';
            }
        }

        $scope.deleteUser = function( id ){
            var reassingEvaluations = false;
            if( 'undefined' !== typeof $scope.newUser ) reassingEvaluations = true;

            UserService.deleteUser( $scope.token, id, reassingEvaluations, $scope.newUser, function ( response ){
                console.log( response );
                if(response.errors) {
                    ErrorHelper.display( response.errors );
                    return;
                }
                Materialize.toast('¡Se ha eliminado el usuario correctamente!', 4000, 'green');
                $state.go('/view-users', {}, { reload: true });
            });
        }


        /******************
        * PRIVATE FUNCTIONS
        *******************/

        function initUsers( currentPath ){
            if( 'undefined' != typeof $rootScope.globals.currentUser ){
                $scope.authToken = $rootScope.globals.currentUser.authdata;
                $scope.role = $rootScope.globals.currentUser.role;    
            }
                
            if( currentPath.indexOf( '/view-user-request/' ) > -1 ){
                getNewUserRequest( $stateParams.requestId );
                fetchAgencies();
                fetchCompanies();
                return;
            }

             if( currentPath.indexOf( '/delete-user/' ) > -1 ){
                LoaderHelper.showLoader('Cargando información del usuario...');
                getUser( $stateParams.userId );
                return;
            }

            if( currentPath.indexOf( '/reset-password' ) > -1 ){
                $scope.token = $stateParams.passwordToken;
                return;
            }

            switch( currentPath ){
                case '/view-user-requests':
                    getAgencyUserRequests();
                    getBrandUserRequests();
                    break;
                case '/add-user':
                    fetchAgencies();
                    fetchCompanies();
                    if( $scope.role == 2 ){
                        getAgency( $scope.globals.currentUser.agencyId );
                    }
                    if( $scope.role == 4 ){
                        getCompany( $scope.globals.currentUser.companyId );
                    }
                    break;
                case '/view-users':
                    LoaderHelper.showLoader('Obteniendo usuarios...');
                    if( $scope.role == 2 ){
                        fetchAgencyUsers( $scope.globals.currentUser.agencyId );
                    } else {
                        fetchUsers();
                    }
                    break;
                case '/view-admin-users':
                    LoaderHelper.showLoader('Obteniendo administradores...');
                    fetchAdminUsers();
                    break;
            }
        }

        function fetchUsers(){
            UserService.getAll( function( users ){
                $scope.users = users;
                LoaderHelper.hideLoader();
            }); 

        }// fetchUsers

        function fetchAdminUsers(){
            UserService.getAdminUsers( function( users ){
                $scope.users = users;
                LoaderHelper.hideLoader();
            }); 

        }// fetchAdminUsers

        function getNewUserRequest( id ){
            UserService.getNewUserRequest( id, function( user ){
                console.log( user );
                $scope.user = user;
            }); 
        }// getNewUserRequest

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

        function getBrandUserRequests(){
            UserService.getBrandUserRequests( function( userRequests ){
                $scope.brandUserRequests = userRequests;
            }); 
        }// getBrandUserRequests

        function getAgency( id ){
            AgencyService.show( id, function( agency ){
                console.log( agency );
                $scope.agencyName = agency.name;
            }); 
        }

        function getCompany( id ){
            CompanyService.show( id, function( company ){
                console.log( company );
                $scope.companyName = company.name;
            }); 
        }

        function fetchAgencyUsers( id ){
            AgencyService.getUsers( id, function( users ){
                $scope.users = users;
                LoaderHelper.hideLoader();
            }); 
        }// fetchAgencyUsers

        function getUser( id ){
            UserService.get( id, function( user ){
                console.log( user );
                $scope.user = user;
                LoaderHelper.hideLoader();
                if( user.agency_id !== -1 ) fetchAgencyUsers( user.agency_id );
            }); 
        }// getNewUserRequest

    }]);