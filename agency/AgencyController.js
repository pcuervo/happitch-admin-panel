conAngular
    .controller('AgencyController', ['$scope', '$rootScope', '$location', '$state', '$stateParams', 'UserService', 'AgencyService', 'AuthenticationService', 'CompanyService', 'DashboardService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTDefaultOptions', function( $scope, $rootScope, $location, $state, $stateParams, UserService, AgencyService, AuthenticationService, CompanyService, DashboardService, DTOptionsBuilder, DTColumnDefBuilder, DTDefaultOptions ){

    (function initController() {
        $scope.auth_token = $rootScope.globals.currentUser.authdata;
        var currentPath = $location.path();
        initAgency( currentPath );
    })();

    $scope.createSkillCat = function(){
        AgencyService.createSkillCat( $scope.authToken, $scope.name, function ( response ){
            $scope.skillCatResponse = response;
            if(response.errors) {
                console.log( response.errors );
                ErrorHelper.display( response.errors );
                return;
            }
            Materialize.toast('¡Se ha creado la categoría "' + $scope.name + '"!', 4000, 'green');
        });
    }// createSkillCat

    $scope.createSkill = function(){
        AgencyService.createSkill( $scope.authToken, $scope.name, $scope.skillCat, function ( response ){
            $scope.showAgenciesResponse = true;
            $scope.skillCatResponse = response;
            if(response.errors) {
                ErrorHelper.display( response.errors );
                return;
            }
            Materialize.toast('¡Se ha creado la categoría "' + $scope.name + '"!', 4000, 'green');
        });
    }// createSkill

    $scope.createAgency = function(){
        var goldenPitch = $('#checkbox-golden-pitch:checked').length;
        var silverPitch = $('#checkbox-silver-pitch:checked').length;
        var mediumRiskPitch = $('#checkbox-medium-risk-pitch:checked').length;
        var highRiskPitch = $('#checkbox-high-risk-pitch:checked').length;

        var logoFilename = '';
        if( 'undefined' !== typeof $scope.imageExt ){
            logoFilename = FormatHelper.slug( $scope.name ) + '.' + $scope.imageExt;
        }

        AgencyService.create( $scope.authToken, $scope.name, $scope.phone, $scope.contactName, $scope.contactEmail, $scope.address, '', '', $scope.websiteUrl, $scope.numEmployees, goldenPitch, silverPitch, mediumRiskPitch, highRiskPitch, $scope.image, logoFilename, function ( response ){
            if(response.errors) {
                ErrorHelper.display( response.errors );
                return;
            }
            Materialize.toast('¡Se ha creado la agencia "' + $scope.name + '"!', 4000, 'green');
            $state.go('/view-agencies', {}, { reload: true });
        });
    }// createAgency

    $scope.addSkill = function(){
        skillToAdd = {};
        skillToAdd['level'] = $('#level').val();
        skillToAdd['id'] = $('#skill').val()
        skillToAdd['name'] = $('#skill option:selected').text()
        $scope.skillsAdded.push(skillToAdd);
        $('#skill').val('');
        $('#level').val('');
    }

    $scope.removeSkill = function( index ){
        $scope.skillsAdded.splice( index, 1 );
    }// removePart

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
            default:
                icon = 'property';
        }   
        return icon;
    }

    $scope.getUserRole = function( role ){
        if( 1 == role ) return 'Administrador AMAP';
        if( 2 == role ) return 'Administrador Agencia';
        if( 4 == role ) return 'Administrador Anunciante';
        return '-';
    }

    $scope.getSize = function( numEmployees ){
        if( numEmployees < 40 ) return 'Chica';
        if( numEmployees > 40 && numEmployees < 90 ) return 'Mediana';
        if( numEmployees > 90 ) return 'Grande';
    }

    /*********************
    * #GENERAL FUNCTIONS
    *********************/

    function initAgency( path ){
        $scope.authToken = $rootScope.globals.currentUser.authdata;
        if( path.indexOf( '/view-agency/' ) > -1 ){
            getAgency( $stateParams.agencyId );
            // getRecommendations( $stateParams.agencyId );
            // fetchAgencyUsers( $stateParams.agencyId );
            AgencyService.dashboardSummary( $scope.auth_token, $stateParams.agencyId, function( stats ){
                $scope.users = stats.users;
                $scope.happitch = stats.happitch;
                $scope.happy = stats.happy;
                $scope.ok = stats.ok;
                $scope.unhappy = stats.unhappy;
                $scope.recommendations = stats.recommendations;
                initChartLostVsWon( stats.lost, stats.won );
                LoaderHelper.hideLoader();
                console.log( stats );
            });
            initUsersDataTable();
            return;
        }

        switch( path ){
            case '/view-skill-categories':
                fetchSkillCategories();
                initSkillCatDataTable();
                break;
            case '/create-skill':
                fetchSkillCategories();
                break;
            case '/view-skills':
                fetchSkills();
                initSkillDataTable();
                break;
            case '/view-agencies':
                fetchAgencies();
                initAgencyDataTable();
                break;
            case '/add-agency':
                $("#create-agency-logo").change(function(){
                    getImgData( 'create-agency-logo' );
                });
                break;
        }

    }

    function initSkillCatDataTable(){
        $scope.dtSkillCatOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(10)
                .withDOM('itp')
                .withOption('responsive', true)
                .withOption('order', [])
                .withOption('searching', false);
        DTDefaultOptions.setLanguageSource('https://cdn.datatables.net/plug-ins/1.10.9/i18n/Spanish.json');
    }// initSkillCatDataTable

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

    function initAgencyDataTable(){
        $scope.dtAgencyOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(10)
                .withDOM('itp')
                .withOption('responsive', true)
                .withOption('order', [])
                .withOption('searching', false);
        DTDefaultOptions.setLanguageSource('https://cdn.datatables.net/plug-ins/1.10.9/i18n/Spanish.json');
    }// initAgencyDataTable

    function initUsersDataTable(){
        $scope.dtUsersOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(5)
                .withDOM('tp')
                .withOption('responsive', true)
                .withOption('order', [])
                .withOption('searching', false);
        DTDefaultOptions.setLanguageSource('https://cdn.datatables.net/plug-ins/1.10.9/i18n/Spanish.json');
    }// initUsersDataTable

    /*********************
    * #API FUNCTIONS
    *********************/
    
    function createNewUserRequest( email, agencyBrand, userType ){
        UserService.createNewUserRequest( email, agencyBrand, userType, function ( response ){
            $scope.showUserRequestResponse = true;
            $scope.response = response;
            if(response.errors) {
                Materialize.toast('New user request could not be created!', 4000, 'red');
                return;
            }
            Materialize.toast('New user request created!', 4000, 'green');
        });
    }

    function confirmRequest( email, agencyId, role, isMemberAMAP ){
        UserService.confirmUserRequest( email, agencyId, role, isMemberAMAP, function ( response ){
                $scope.showUserRequestResponse = true;
                $scope.response = response;
                if(response.errors) {
                    Materialize.toast('Request could not be confirmed!', 4000, 'red');
                    return;
                }
                Materialize.toast('User request confirmed! A new user has been created.', 4000, 'green');
        });
    }

    function rejectRequest( email ){
        UserService.rejectUserRequest( email, function ( response ){
                $scope.showUserRequestResponse = true;
                $scope.response = response;
                if(response.errors) {
                    Materialize.toast('Request could not be confirmed!', 4000, 'red');
                    return;
                }
                Materialize.toast('User request rejected! An email has been sent to user with the details abouth the rejection', 6000, 'green');
        });
    }

    function loginUser( email, password ){
        AuthenticationService.login( email, password, function ( response ){
            $scope.showSessionResponse = true;
            $scope.sessionResponse = response;
            if(response.errors) {
                console.log(response.errors);
                Materialize.toast('Could not log in user!', 4000, 'red');
                return;
            }
            Materialize.toast('User logged in! A new session has been created.', 4000, 'green');
        });
    }

    function logoutUser( token ){
        AuthenticationService.logout( token, function ( response ){
            console.log( response );
            $scope.showSessionResponse = true;
            $scope.sessionResponse = response;
            console.log( $scope.sessionResponse );
            if(response.errors) {
                console.log(response.errors);
                Materialize.toast('Could not log out user!', 4000, 'red');
                return;
            }
            Materialize.toast('User logged out! The sessions has been destroyed.', 4000, 'green');
        });
    }

    function createAgency( authToken, name, phone, contactName, contactEmail, address, latitude, longitude, websiteUrl, numEmployees, goldenPitch, silverPitch, mediumPitch, highPitch, logo, logoFilename ){
        AgencyService.create( authToken, name, phone, contactName, contactEmail, address, latitude, longitude, websiteUrl, numEmployees, goldenPitch, silverPitch, mediumPitch, highPitch, logo, logoFilename, function ( response ){
            $scope.showAgenciesResponse = true;
            $scope.agencyResponse = response;
            if(response.errors) {
                Materialize.toast('Agency could not be created!', 4000, 'red');
                return;
            }
            Materialize.toast('Agency created!', 4000, 'green');
        });
    }// createAgency

    function updateAgency( id, authToken, name, phone, contactName, contactEmail, address, latitude, longitude, websiteUrl, numEmployees, goldenPitch, silverPitch, mediumPitch, highPitch, logo, logoFilename ){
        AgencyService.update( id, authToken, name, phone, contactName, contactEmail, address, latitude, longitude, websiteUrl, numEmployees, goldenPitch, silverPitch, mediumPitch, highPitch, logo, logoFilename, function ( response ){
            $scope.showAgenciesResponse = true;
            $scope.agencyResponse = response;
            if(response.errors) {
                Materialize.toast('Agency could not be created!', 4000, 'red');
                return;
            }
            Materialize.toast('Agency created!', 4000, 'green');
        });
    }// updateAgency

    function showAgency( id ){
        AgencyService.show( id, function ( response ){
            $scope.showAgenciesResponse = true;
            $scope.agencyResponse = response;
            if(response.errors) {
                Materialize.toast('Agency could not be fetched!', 4000, 'red');
                return;
            }
            Materialize.toast('Agency fetched!', 4000, 'green');
        });
    }// showAgency

    function addSkillsToAgency( authToken, id, skills ){
        AgencyService.addSkills( authToken, id, skills, function ( response ){
            $scope.showAgenciesResponse = true;
            $scope.agencyResponse = response;
            if(response.errors) {
                Materialize.toast('Skills could not be added!', 4000, 'red');
                return;
            }
            Materialize.toast('Skills added!', 4000, 'green');
        });
    }// addSkillsToAgency

    function createCase( authToken, agencyId, name, description, url, image, filename  ){
        AgencyService.createCase( authToken, agencyId, name, description, url, image, filename, function ( response ){
            $scope.showAgenciesResponse = true;
            $scope.successCaseResponse = response;
            if(response.errors) {
                console.log( response.errors );
                Materialize.toast('Success case could not be created!', 4000, 'red');
                return;
            }
            Materialize.toast('Success case created!', 4000, 'green');
        });
    }// createCase

    function updateCase( id, authToken, agencyId, name, description, url, image, filename  ){
        AgencyService.updateCase( id, authToken, agencyId, name, description, url, image, filename, function ( response ){
            $scope.showAgenciesResponse = true;
            $scope.successCaseResponse = response;
            if(response.errors) {
                console.log( response.errors );
                Materialize.toast('Success case could not be updated!', 4000, 'red');
                return;
            }
            Materialize.toast('Success case updated!', 4000, 'green');
        });
    }// updateCase

    function showCase( id ){
        AgencyService.showCase( id, function ( response ){
            $scope.showAgenciesResponse = true;
            $scope.successCaseResponse = response;
            if(response.errors) {
                Materialize.toast('Case could not be fetched!', 4000, 'red');
                return;
            }
            Materialize.toast('Case fetched successfully!', 4000, 'green');
        });
    }// showCase

    function destroyCase( id, authToken ){
        AgencyService.destroyCase( id, authToken, function ( response ){
            $scope.showAgenciesResponse = true;
            $scope.successCaseResponse = response;
            if(response.errors) {
                Materialize.toast('Case could not be destroyed!', 4000, 'red');
                return;
            }
            Materialize.toast('Case destroyed successfully!', 4000, 'green');
        });
    }// destroyCase

    function showSkillCat( id ){
        AgencyService.showSkillCat( id, function ( response ){
            $scope.showAgenciesResponse = true;
            $scope.skillCatResponse = response;
            if(response.errors) {
                Materialize.toast('SkillCategory could not be fetched!', 4000, 'red');
                return;
            }
            Materialize.toast('SkillCategory fetched successfully!', 4000, 'green');
        });
    }// showSkillCat

    function getSkillCategories(){
        AgencyService.getSkillCategories( function ( response ){
            $scope.showAgenciesResponse = true;
            $scope.skillCatResponse = response;
            if(response.errors) {
                Materialize.toast('SkillCategory could not be fetched!', 4000, 'red');
                return;
            }
            Materialize.toast('SkillCategory fetched successfully!', 4000, 'green');
        });
    }// getSkillCategories

    function showSkill( id ){
        AgencyService.showSkill( id, function ( response ){
            $scope.showAgenciesResponse = true;
            $scope.skillCatResponse = response;
            if(response.errors) {
                Materialize.toast('Skill could not be fetched!', 4000, 'red');
                return;
            }
            Materialize.toast('Skill fetched successfully!', 4000, 'green');
        });
    }// showSkill

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
    
    function fetchAgencies(){
        AgencyService.getAll( function( agencies ){
            console.log(agencies);
            $scope.agencies = agencies;
        }); 
    }// fetchAgencies

    function fetchSkillCategories(){
        AgencyService.getSkillCategories( function( response ){
            $scope.skillCategories = response.skill_categories;
        }); 
    }// fetchSkillCategories

    function fetchSkills(){
        AgencyService.getSkills( function( skills ){
            console.log(skills);
            $scope.skills = skills;
        }); 
    }// fetchSkills

    function fetchCompanies(){
        CompanyService.getAll( function( response ){
            console.log( response );
            $scope.companies = response.companies;
        }); 
    }// fetchCompanies

    function getImgData( id ){
        var imgId = id;
        var fileInput = document.getElementById( imgId );
        file = fileInput.files[0];
        fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = function(){
            $scope.image = fr.result;
            $scope.imageExt = file.name.split('.').pop().toLowerCase();
            console.log($scope.imageExt);
        }
    }// getItemImg

    function getAgency( id ){
        AgencyService.show( id, function( agency ){
            console.log( agency );
            $scope.agency = agency;
            $scope.hasMap = false;
            $scope.agencySize = $scope.getSize( agency.num_employees );
            console.log( agency.latitude );
            if( null != agency.latitude ){
                $scope.hasMap = true;
                initGeoAutocomplete( '#address', '#map', agency.latitude, agency.longitude, 15 );
            }
        }); 
    }// getAgency

    function getRecommendations( id ){
        AgencyService.getRecommendations( id, function( recommendations ){
            $scope.recommendations = recommendations;
        }); 
    }// getRecommendations

    function initGeoAutocomplete( addressId, mapId, latitude, longitude, zoom ){
        $('#map').css('height', '400px');
        var latLng = new google.maps.LatLng( latitude, longitude )
        $(addressId).geocomplete({
            details: ".input-field",
            detailsAttribute: "data-geo",
            map: mapId,
            markerOptions: {
                position: latLng,
                map: "mapId"
            }
        });
        var map = $(addressId).geocomplete("map");
        map.setCenter( latLng );
        map.setZoom( zoom );
    }

    function initChartLostVsWon( won, lost ){

        $scope.lostVsWonData = [];
        $scope.lostVsWonData.push( { label: "Ganados", data: won, color: "#429321" } );
        $scope.lostVsWonData.push( { label: "Perdidos", data: lost, color: "#fd1644" } );
        
        $scope.lostVsWonOpts = {
            series: {
                pie: {
                    innerRadius: 0.8,
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

}]);