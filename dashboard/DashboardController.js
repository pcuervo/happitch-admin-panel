conAngular.controller('DashboardController', [ '$rootScope', '$scope', 'UserService', 'DashboardService', 'AgencyService', 'CompanyService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTDefaultOptions', function( $rootScope, $scope, UserService, DashboardService, AgencyService, CompanyService, DTOptionsBuilder, DTColumnDefBuilder, DTDefaultOptions ) {

    (function initController() {
        $scope.role = $rootScope.globals.currentUser.role;
        $scope.auth_token = $rootScope.globals.currentUser.authdata;
        initDashboard( $scope.role ); 
    })();

    /******************
    * PUBLIC FUNCTIONS
    *******************/

    $scope.getUserName = function( user ){
        if( user.first_name ) return user.first_name + ' ' + user.last_name;
        return '-';
    }

    $scope.getUserRole = function( role ){
        if( 1 == role ) return 'Administrador AMAP';
        if( 2 == role ) return 'Administrador Agencia';
        if( 4 == role ) return 'Administrador Anunciante';
        return '-';
    }

    $scope.getRecoIcon = function( recoId ){
        var icon;
        switch( recoId ){
            case 'agency_communication':
            case 'agency_list':
                icon = 'communication';
                break;
            case 'agency_budget_1':
                icon = 'list';
                break;
            case 'agency_budget_3':
            case 'agency_sharing':
            case 'agency_number_5':
            case 'agency_number_7':
                icon = 'budget';
                break;
            case 'agency_time':
                icon = 'criteria';
                break;
            case 'agency_property':
                icon = 'eye';
                break;
            case 'agency_deliverable':
                icon = 'number';
                break;
            case 'agency_careful':
                icon = 'time';
                break;
            case 'agency_speak':
                icon = 'moreTime';
                break;
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
            case 'client_deliverable_25':
            case 'client_deliverable_50':
            case 'client_deliverable_75':
            case 'client_deliverable_100':
                icon = 'deliverable';
                break;
            default:
                icon = 'property';
        }   
        return icon;
    }


    /******************
    * PRIVATE FUNCTIONS
    *******************/

    function initDashboard( role ){
        switch( role ){
            case 1:
                initDashboardAdmin();
                getAgencyUserRequests();
                getBrandUserRequests();
                initAgencyUserDataTable();
                initBrandUserDataTable();
                break;
            case 2:
                initDashboardAgency();
                fetchAgencyUsers( $rootScope.globals.currentUser.agencyId );
                break;
            case 4:
                initDashboardCompany();
                fetchCompanyUsers( $rootScope.globals.currentUser.agencyId );
                break;
        }
        
    }// initDashboard

    function initDashboardAdmin(){
        // Init data
        LoaderHelper.showLoader('Calculando estadísticas...');

        DashboardService.amap( function( stats ){
            $scope.totalAgencies = stats.total_agencies;
            $scope.totalPitches = stats.total_pitches;
            $scope.totalCompanies = stats.total_companies;
            $scope.totalBrands = stats.total_brands;
            $scope.worstPitches = stats.worst_pitches;
            $scope.topPitches = stats.top_pitches;
            initChartPitchesByType( stats.total_happitch, stats.total_happy, stats.total_ok, stats.total_unhappy );
            initChartClosedVsPending( stats.total_pending, stats.total_closed );
            LoaderHelper.hideLoader();
        });
    }

    function initDashboardAgency(){
        // Init data
        LoaderHelper.showLoader('Obteniendo resumen de la agencia...');

        AgencyService.dashboardSummary( $scope.auth_token, $rootScope.globals.currentUser.agencyId, function( stats ){
            $scope.totalUsers = stats.users.length;
            $scope.happitch = stats.happitch;
            $scope.happy = stats.happy;
            $scope.ok = stats.ok;
            $scope.unhappy = stats.unhappy;
            $scope.recommendations = stats.recommendations;
            initChartLostVsWon( stats.lost, stats.won );
            LoaderHelper.hideLoader();
        });

        AgencyService.dashboardAvgPerMonth( $scope.auth_token, $rootScope.globals.currentUser.agencyId, function( stats ){
            //LoaderHelper.hideLoader();
        });
        
    }

    function initDashboardCompany(){
        // Init data
        LoaderHelper.showLoader('Obteniendo resumen del anunciante...');

        CompanyService.dashboardSummary( $scope.auth_token, $rootScope.globals.currentUser.agencyId, function( stats ){
            $scope.happitch = stats.happitch;
            $scope.happy = stats.happy;
            $scope.ok = stats.ok;
            $scope.unhappy = stats.unhappy;
            $scope.recommendations = stats.recommendations;
            initChartLostVsWon( stats.lost, stats.won );
            //LoaderHelper.hideLoader();
        });

        CompanyService.dashboardAvgPerMonth( $scope.auth_token, $rootScope.globals.currentUser.agencyId, function( stats ){
            LoaderHelper.hideLoader();
        });
        
    }

    function initAgencyUserDataTable(){
        $scope.dtAgencyUserRequestsOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(20)
                .withDOM('itp')
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

    function initChartPitchesByType( totalHappitch, totalHappy, totalOk, totalUnhappy ){

        $scope.pitchesByTypeData = [];
        $scope.pitchesByTypeData.push( { label: "happitch", data:totalHappitch } );
        $scope.pitchesByTypeData.push( { label: "happy", data: totalHappy } );
        $scope.pitchesByTypeData.push( { label: "ok", data: totalOk } );
        $scope.pitchesByTypeData.push( { label: "unhappy", data: totalUnhappy } );
        
        $scope.pitchesByTypeOpts = {
            series: {
                pie: {
                    innerRadius: 0.3,
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

    function initChartClosedVsPending( closed, pending ){

        $scope.closedVsPendingData = [];
        $scope.closedVsPendingData.push( { label: "cerrados", data: closed } );
        $scope.closedVsPendingData.push( { label: "pendientes", data: pending } );
        
        $scope.closedVsPendingOpts = {
            series: {
                pie: {
                    innerRadius: 0.3,
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
    }// initChartClosedVsPending

    function initChartLostVsWon( lost, won ){

        $scope.lostVsWonData = [];
        $scope.lostVsWonData.push( { label: "ganados", data: won } );
        $scope.lostVsWonData.push( { label: "perdidos", data: lost } );
        
        $scope.lostVsWonOpts = {
            series: {
                pie: {
                    innerRadius: 0.3,
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
    }// initChartLostVsWon

    function fetchAgencyUsers( id ){
        AgencyService.getUsers( id, function( users ){
            $scope.users = users;
        }); 
    }// fetchAgencyUsers

    function fetchCompanyUsers( id ){
        CompanyService.getUsers( id, function( users ){
            $scope.users = users;
        }); 
    }// fetchCompanyUsers

}]);