conAngular.controller('DashboardController', [ '$rootScope', '$scope', '$state', 'UserService', 'DashboardService', 'AgencyService', 'CompanyService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTDefaultOptions', function( $rootScope, $scope, $state, UserService, DashboardService, AgencyService, CompanyService, DTOptionsBuilder, DTColumnDefBuilder, DTDefaultOptions ) {

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

    $scope.declineRequest = function( email ){
        UserService.rejectUserRequest( email, function ( response ){
            if(response.errors) {
                ErrorHelper.display( response.errors );
                return;
            }
            Materialize.toast( response.success, 4000, 'green');
            $state.go('/dashboard', {}, { reload: true });
        });
    }// declineRequest


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

        $scope.monthlyPitchesData = [];
        $scope.monthlyPitchesOpts = {};
        addMonthlyPitchesTooltip();
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
            initChartMonthlyPitches( stats.pitches_by_month )
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

    function initChartMonthlyPitches( pitchesData ){
        var monthlyPitchesData = [];
        var ticks = [];
        console.log( pitchesData );

        $.each( pitchesData, function(i, val){
            monthlyPitchesData.push( [i+1, val.num_pitches] );
            ticks.push( [i+1, val.month_year] );
        });
        $scope.monthlyPitchesData = [{
            data: monthlyPitchesData,
            label: "Pitches mensuales"
        }];

        $scope.monthlyPitchesOpts = {
            series: {
                lines: {
                    show: true,
                    lineWidth: 1,
                    fill: true, 
                    fillColor: { colors: [ { opacity: 0.1 }, { opacity: 0.13 } ] }
                },
                points: {
                    show: true, 
                    lineWidth: 3,
                    radius: 5
                },
                shadowSize: 0,
                stack: true
            },
            grid: {
                hoverable: true, 
                clickable: true, 
                tickColor: "#f9f9f9",
                borderWidth: 0
            },
            legend: {
                // show: false
                backgroundOpacity: 0,
                labelBoxBorderColor: "#fff"
            },  
            colors: ["#3f51b5", "#009688", "#2196f3"],
            xaxis: {
                ticks: ticks,
                font: {
                    family: "Roboto,sans-serif",
                    color: "#888"
                }
            },
            yaxis: {
                ticks:7, 
                tickDecimals: 0,
                font: {color: "#888"}
            }
        };
    }// initChartMonthlyPitches

    function addMonthlyPitchesTooltip(){
        $scope.monthlyPitchesOpts['conTooltip'] = function(chart) {
            console.log( 'hi' );
            function showTooltip(x, y, contents) {
                $('<div id="tooltip">' + contents + '</div>').css( {
                    position: 'absolute',
                    display: 'none',
                    top: y - 50,
                    left: x - 35,
                    color: "#fff",
                    padding: '10px 10px',
                    'border-radius': '5px',
                    'background-color': 'rgba(0,0,0,0.6)'
                }).appendTo("body").fadeIn(200);
            }// showToolTip

            var previousPoint = null;
            chart.bind("plothover.conApp", function (event, pos, item) {
                if (item) {
                    if (previousPoint != item.dataIndex) {
                        previousPoint = item.dataIndex;

                        $("#tooltip").remove();
                        var x = item.datapoint[0].toFixed(0),
                            y = item.datapoint[1].toFixed(0);

                        var month = item.series.xaxis.ticks[item.dataIndex].label;

                        showTooltip(item.pageX, item.pageY,
                                    'Pitches' + " en " + month + ": " + y);
                    }
                }
                else {
                    $("#tooltip").remove();
                    previousPoint = null;
                }
            });
        } 
    }

}]);