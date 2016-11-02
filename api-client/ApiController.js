conAngular
    .controller('ApiController', ['$scope', '$rootScope', '$location', '$state', 'UserService', 'AgencyService', 'AuthenticationService', 'CompanyService', 'PitchService', function( $scope, $rootScope, $location, $state, UserService, AgencyService, AuthenticationService, CompanyService, PitchService ){

        (function initController() {
            initApi();
            $scope.apiUrl = $rootScope.apiUrl;
            $scope.apiKey = $rootScope.apiKey;
        })();

        $scope.newUserRequest = function( action ){
            switch( action ){
                case 'create':
                    createNewUserRequest( this.cnur.email, this.cnur.agencyBrand, this.cnur.userType );
                    break;
                case 'confirm':
                    confirmRequest( this.confirmReq.email, this.confirmReq.agencyId, this.confirmReq.role, this.confirmReq.isMemberAMAP );
                    break;
                case 'reject':
                    rejectRequest( this.rejectReq.email );
                    break;
            }
        }// newUserRequest

        $scope.agencyService = function( action ){
            switch( action ){
                case 'create':
                    var goldenPitch = $('#checkbox-golden-pitch:checked').length;
                    var silverPitch = $('#checkbox-silver-pitch:checked').length;
                    var mediumRiskPitch = $('#checkbox-medium-risk-pitch:checked').length;
                    var highRiskPitch = $('#checkbox-high-risk-pitch:checked').length;

                    var logoFilename = '';
                    if( 'undefined' !== typeof $scope.imageExt ){
                        logoFilename = FormatHelper.slug( this.createAgency.name ) + '.' + $scope.imageExt;
                    }
                    console.log(logoFilename);
                    createAgency( this.createAgency.authToken, this.createAgency.name, this.createAgency.phone, this.createAgency.contactName, this.createAgency.contactEmail, this.createAgency.address, this.createAgency.latitude, this.createAgency.longitude, this.createAgency.websiteUrl, this.createAgency.numEmployees, goldenPitch, silverPitch, mediumRiskPitch, highRiskPitch, $scope.image, logoFilename );
                    break;
                case 'update':
                    var goldenPitch = $('#checkbox-update-golden-pitch:checked').length;
                    var silverPitch = $('#checkbox-update-silver-pitch:checked').length;
                    var mediumRiskPitch = $('#checkbox-update-medium-risk-pitch:checked').length;
                    var highRiskPitch = $('#checkbox-update-high-risk-pitch:checked').length;
                    var logoFilename = '';
                    if( 'undefined' !== typeof $scope.imageExt ){
                        logoFilename = FormatHelper.slug( this.updateAgency.name ) + '.' + $scope.imageExt;
                    }
                    updateAgency( this.updateAgency.id, this.updateAgency.authToken, this.updateAgency.name, this.updateAgency.phone, this.updateAgency.contactName, this.updateAgency.contactEmail, this.updateAgency.address, this.updateAgency.latitude, this.updateAgency.longitude, this.updateAgency.websiteUrl, this.updateAgency.numEmployees, goldenPitch, silverPitch, mediumRiskPitch, highRiskPitch, $scope.image, logoFilename );
                    break;
                case 'show':
                    showAgency( this.showAgency.id );
                    break;
                case 'addSkills':
                    addSkillsToAgency( this.addSkills.authToken, this.addSkills.id, $scope.skillsAdded );
                    break;
                case 'addCriteria':
                    var criteriaIds = getCriteriaIds( $scope.criteriaAdded );
                    addCriteriaToAgency( this.addCriteria.authToken, this.addCriteria.id, criteriaIds );
                    break;
                case 'addExclusivity':
                    addExclusivityToAgency( this.addExclusivity.authToken, this.addExclusivity.id, $scope.brandsAdded );
                    break;
            }
        }// agencies

        $scope.sessions = function( action ){
            switch( action ){
                case 'login':
                    loginUser( this.sessions.email, this.sessions.password );
                    break;
                case 'logout':
                    logoutUser( this.sessions.authorizationToken );
                    break;
            }
        }

        $scope.successCaseService = function( action ){
            switch( action ){
                case 'create':
                    var filename = '';
                    if( 'undefined' !== typeof $scope.imageExt ){
                        filename = FormatHelper.slug( this.createCase.name ) + '.' + $scope.imageExt;
                    }
                    createCase( this.createCase.authToken, this.createCase.agencyId, this.createCase.name, this.createCase.description, this.createCase.url, $scope.image, filename );
                    break;
                case 'update':
                    var filename = '';
                    if( 'undefined' !== typeof $scope.imageExt ){
                        filename = FormatHelper.slug( this.updateCase.name ) + '.' + $scope.imageExt;
                    }
                    updateCase( this.updateCase.id, this.updateCase.authToken, this.updateCase.agencyId, this.updateCase.name, this.updateCase.description, this.updateCase.url, $scope.image, filename );
                    break;
                case 'show':
                    showCase( this.showCase.id );
                    break;
                case 'destroy':
                    destroyCase( this.destroyCase.id, this.destroyCase.authToken );
                    break;
            }
        }// successCaseService

        $scope.skillCatService = function( action ){
            switch( action ){
                case 'create':
                    createSkillCat( this.createSkillCat.authToken, this.createSkillCat.name );
                    break;
                case 'index':
                    getSkillCategories()
                    break;
                case 'show':
                    showSkillCat( this.showSkillCat.id );
                    break;
            }
        }// skillCatService

        $scope.skillService = function( action ){
            switch( action ){
                case 'create':
                    createSkill( this.createSkill.authToken, this.createSkill.name, this.createSkill.skillCat );
                    break;
                case 'index':
                    getSkillCategories();
                    break;
                case 'show':
                    showSkill( this.showSkill.id );
                    break;
            }
        }// skillService

        $scope.companyService = function( action ){
            switch( action ){
                case 'create':
                    createCompany( this.createCompany.authToken, this.createCompany.name );
                    break;
                case 'index':
                    getCompanies();
                    break;
                case 'show':
                    showCompany( this.showCompany.id );
                    break;
                case 'indexBrands':
                    getBrands();
                    break;
                case 'showBrand':
                    showBrand( this.showBrand.id );
                    break;
                case 'createBrand':
                    createBrand( this.createBrand.authToken, this.createBrand.name, this.createBrand.contactName, this.createBrand.contactEmail, this.createBrand.contactPosition, this.createBrand.company );
                    break;
                case 'showBrandByCompany':
                    showBrandByCompany( this.showBrandByCompany.company );
                    break;
            }
        }// skillService

        $scope.pitchService = function( action ){
            switch( action ){
                case 'create':
                    createPitch( this.createPitch.authToken, this.createPitch.name, this.createPitch.brand, this.createPitch.briefDate, this.createPitch.briefEmailContact, $scope.skillCategoriesAdded );
                    break;
                case 'index':
                    getPitches();
                    break;
                case 'show':
                    showPitch( this.showPitch.id );
                    break;
                case 'pitchesByBrand':
                    pitchesByBrand( this.pitchesByBrand.brand );
                    break;
                case 'createPitchEval':
                    var objectivesClear = $('#checkbox-clear-objectives:checked').length;
                    var selectionCriteria = $('#checkbox-selection-criteria:checked').length;
                    var budgetKnown = $('#checkbox-budget-known:checked').length;
                    var deliverablesClear = $('#checkbox-deliverables-clear:checked').length;

                    createPitchEval( this.createPitchEval.authToken, this.createPitchEval.pitch, objectivesClear, selectionCriteria, budgetKnown, this.createPitchEval.timeToPresent, this.createPitchEval.numberAgencies, deliverablesClear, this.createPitchEval.isMktInvolved, this.createPitchEval.timeKnowDecision, this.createPitchEval.copyright, this.createPitchEval.numberRounds );
                    break;
                case 'byUser':
                    pitchesByUser( this.byUser.authToken );
                    break;
                case 'updatePitchEval':
                    var objectivesClear = $('#checkbox-clear-objectives:checked').length;
                    var selectionCriteria = $('#checkbox-selection-criteria:checked').length;
                    var budgetKnown = $('#checkbox-budget-known:checked').length;
                    var deliverablesClear = $('#checkbox-deliverables-clear:checked').length;

                    updatePitchEval( this.updatePitchEval.authToken, this.updatePitchEval.id, this.updatePitchEval.pitch, objectivesClear, selectionCriteria, budgetKnown, this.updatePitchEval.timeToPresent, this.updatePitchEval.numberAgencies, deliverablesClear, this.updatePitchEval.isMktInvolved, this.updatePitchEval.timeKnowDecision, this.updatePitchEval.copyright, this.updatePitchEval.numberRounds );
                    break;
                case 'cancel':
                    cancelPitch( this.cancel.id, this.cancel.authToken );
                    break;
                case 'decline':
                    declinePitch( this.decline.id, this.decline.authToken );
                    break;
                case 'archive':
                    archivePitch( this.archive.id, this.archive.authToken );
                    break;
                case 'destroyEvaluation':
                    destroyEvaluation( this.destroyEvaluation.id, this.destroyEvaluation.authToken );
                    break;
            }
        }// pitchService

        $scope.setActive = function( tab ){
            setCollectionInactive();
            $('#'+tab).addClass('active');
            switch( tab ){
                case 'sessions':
                    $scope.isSessions = true;
                    break;
                case 'users':
                    $scope.isUsers = true;
                    break;
                case 'newUserRequests':
                    $scope.isNewUserRequests = true;
                    break;
                case 'agencies':
                    $("#create-agency-logo").change(function(){
                        getImgData( 'create-agency-logo' );
                    });
                    $("#update-agency-logo").change(function(){
                        getImgData( 'update-agency-logo' );
                    });
                    $scope.skillsAdded = [];
                    $scope.criteriaAdded = [];
                    $scope.brandsAdded = [];
                    $scope.isAgencies = true;
                    fetchCriteria();
                    break;
                case 'successCases':
                    $("#create-success-case-image").change(function(){
                        console.log('getting');
                        getImgData( 'create-success-case-image' );
                    });
                    $scope.isCases = true;
                    break;
                case 'skills':
                    $scope.isSkills = true;
                    break;
                case 'companies':
                    $scope.isCompanies = true;
                    break;
                case 'brands':
                    $scope.isBrands = true;
                    break;
                case 'pitches':
                    fetchBrands();
                    fetchPitches();
                    $scope.skillCategoriesAdded = []
                    $scope.isPitches = true;
                    break;
                case 'morePitches':
                    fetchPitches();
                    $scope.isMorePitches = true;
                    break;
                case 'agencyDashboards':
                    $scope.isAgencyDashboards = true;
                    break;
                default:
                    $scope.isNewUserRequests = true;
            }
        }// updateUser

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

        $scope.addSkillCategory = function(){
            $scope.skillCategoriesAdded.push($('#skill-category').val());
            $('#skill-category').val('');
        }

        $scope.removeSkillCategory = function( index ){
            $scope.skillCategoriesAdded.splice( index, 1 );
        }

        $scope.addCriterium = function(){
            criteriumToAdd = {};
            criteriumToAdd['id'] = $('#criterium').val()
            criteriumToAdd['name'] = $('#criterium option:selected').text()
            $scope.criteriaAdded.push(criteriumToAdd);
            $('#criterium').val('');
        }

        $scope.addExclusivityBrand = function(){
            $scope.brandsAdded.push($('#exclusivity-brand').val());
            console.log($scope.brandsAdded);
            $('#exclusivity-brand').val('');
        }

        function initApi(){
            $('ul.tabs').tabs();
            $scope.isNewUserRequests = true;
            $scope.testApiUrl   = 'http://localhost:3000/api/';
            $scope.devApiUrl    = 'https://amap-dev.herokuapp.com/api/';
            $scope.prodApiUrl   = 'https://amap-prod.herokuapp.com/api/'
            $scope.testApiKey   = 'd2d6279345763f64ce21183142e974b8';
            fetchAgencies();
            fetchSkillCategories();
            fetchSkills();
            fetchCompanies();
            //fetchBrands();
            //fetchPitches();
        }

        /*********************
         API FUNCTIONS
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

        function addCriteriaToAgency( authToken, id, criteria ){
            AgencyService.addCriteria( authToken, id, criteria, function ( response ){
                $scope.showAgenciesResponse = true;
                $scope.agencyResponse = response;
                if(response.errors) {
                    Materialize.toast('Criteria could not be added!', 4000, 'red');
                    return;
                }
                Materialize.toast('Criteria added!', 4000, 'green');
            });
        }// addCriteriaToAgency

        function addExclusivityToAgency( authToken, id, brands ){
            AgencyService.addExclusivity( authToken, id, brands, function ( response ){
                $scope.showAgenciesResponse = true;
                $scope.agencyResponse = response;
                if(response.errors) {
                    Materialize.toast('Brands could not be added!', 4000, 'red');
                    return;
                }
                Materialize.toast('Brands added!', 4000, 'green');
            });
        }// addExclusivityToAgency

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

        function createSkillCat( authToken,  name ){
            AgencyService.createSkillCat( authToken, name, function ( response ){
                $scope.showAgenciesResponse = true;
                $scope.skillCatResponse = response;
                if(response.errors) {
                    console.log( response.errors );
                    Materialize.toast('SkillCategory could not be created!', 4000, 'red');
                    return;
                }
                Materialize.toast('SkillCategory created!', 4000, 'green');
            });
        }// createSkillCat

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

        function createSkill( authToken,  name, cat ){
            AgencyService.createSkill( authToken, name, cat, function ( response ){
                $scope.showAgenciesResponse = true;
                $scope.skillCatResponse = response;
                if(response.errors) {
                    console.log( response.errors );
                    Materialize.toast('Skill could not be created!', 4000, 'red');
                    return;
                }
                Materialize.toast('Skill created!', 4000, 'green');
            });
        }// createSkill

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

        function getPitches(){
            PitchService.getAll( function ( response ){
                $scope.showPitchesResponse = true;
                $scope.pitchResponse = response;
                if(response.errors) {
                    Materialize.toast('Pitches could not be fetched!', 4000, 'red');
                    return;
                }
                Materialize.toast('Pitches fetched successfully!', 4000, 'green');
            });
        }// getPitches

        function showPitch( id ){
            PitchService.show( id, function ( response ){
                $scope.showPitchesResponse = true;
                $scope.pitchResponse = response;
                if(response.errors) {
                    Materialize.toast('Pitch could not be fetched!', 4000, 'red');
                    return;
                }
                Materialize.toast('Pitch fetched successfully!', 4000, 'green');
            });
        }// showPitch

        function showBrandByCompany( id ){
            CompanyService.showBrandByCompany( id, function ( response ){
                $scope.showCompaniesResponse = true;
                $scope.companyResponse = response;
                if(response.errors) {
                    Materialize.toast('Brand could not be fetched!', 4000, 'red');
                    return;
                }
                Materialize.toast('Brand fetched successfully!', 4000, 'green');
            });
        }// showBrandByCompany

        function createPitch( authToken, name, brandId, briefDate, briefEmailContact, skillCategories ){
            console.log( skillCategories );
            PitchService.create( authToken, name, brandId, briefDate, briefEmailContact, skillCategories,  function ( response ){
                $scope.showPitchesResponse = true;
                $scope.pitchResponse = response;
                if(response.errors) {
                    Materialize.toast('Pitch could not be created!', 4000, 'red');
                    return;
                }
                Materialize.toast('Pitch created!', 4000, 'green');
            });
        }// createPitch

        function pitchesByBrand( id ){
            PitchService.byBrand( id, function ( response ){
                $scope.showPitchesResponse = true;
                $scope.pitchResponse = response;
                if(response.errors) {
                    Materialize.toast('Pitches could not be fetched!', 4000, 'red');
                    return;
                }
                Materialize.toast('Pitches fetched successfully!', 4000, 'green');
            });
        }// pitchesByBrand

        function createPitchEval( authToken, pitch, objectivesClear, selectionCriteria, budgetKnown, timeToPresent, numberAgencies, deliverablesClear, marketingInvolved, timeKnowDecision, copyright, numberRounds ){
            PitchService.createEvaluation( authToken, pitch, objectivesClear, selectionCriteria, budgetKnown, timeToPresent, numberAgencies, deliverablesClear, marketingInvolved, timeKnowDecision, copyright, numberRounds,  function ( response ){
                $scope.showPitchesResponse = true;
                $scope.pitchResponse = response;
                if(response.errors) {
                    Materialize.toast('PitchEvaluation could not be created!', 4000, 'red');
                    return;
                }
                Materialize.toast('PitchEvaluation created!', 4000, 'green');
            });
        }// createPitchEval

        function updatePitchEval( authToken, id, pitch, objectivesClear, selectionCriteria, budgetKnown, timeToPresent, numberAgencies, deliverablesClear, marketingInvolved, timeKnowDecision, copyright, numberRounds ){
            PitchService.updateEvaluation( authToken, id, pitch, objectivesClear, selectionCriteria, budgetKnown, timeToPresent, numberAgencies, deliverablesClear, marketingInvolved, timeKnowDecision, copyright, numberRounds,  function ( response ){
                $scope.showPitchesResponse = true;
                $scope.pitchResponse = response;
                if(response.errors) {
                    Materialize.toast('PitchEvaluation could not be updated!', 4000, 'red');
                    return;
                }
                Materialize.toast('PitchEvaluation updated!', 4000, 'green');
            });
        }// updatePitchEval

        function pitchesByUser( authToken ){
            PitchService.byUser( authToken, function ( response ){
                $scope.showPitchesResponse = true;
                $scope.pitchResponse = response;
                if(response.errors) {
                    Materialize.toast('Pitches could not be fetched!', 4000, 'red');
                    return;
                }
                Materialize.toast('Pitches created!', 4000, 'green');
            });
        }// byUser

        function cancelPitch( id, authToken ){
            PitchService.cancel( id, authToken, function ( response ){
                $scope.showPitchesResponse = true;
                $scope.pitchResponse = response;
                if(response.errors) {
                    Materialize.toast('Pitches could not be cancelled!', 4000, 'red');
                    return;
                }
                Materialize.toast('Pitch has been cancelled!', 4000, 'green');
            });
        }// cancelPitch

        function declinePitch( id, authToken ){
            PitchService.decline( id, authToken, function ( response ){
                $scope.showPitchesResponse = true;
                $scope.pitchResponse = response;
                if(response.errors) {
                    Materialize.toast('Pitches could not be declined!', 4000, 'red');
                    return;
                }
                Materialize.toast('Pitch has been declined!', 4000, 'green');
            });
        }// declinePitch

        function archivePitch( id, authToken ){
            PitchService.archive( id, authToken, function ( response ){
                $scope.showPitchesResponse = true;
                $scope.pitchResponse = response;
                if(response.errors) {
                    Materialize.toast('Pitches could not be archived!', 4000, 'red');
                    return;
                }
                Materialize.toast('Pitch has been archived!', 4000, 'green');
            });
        }// archivePitch

        function destroyEvaluation( id, authToken ){
            PitchService.destroyEvaluation( id, authToken, function ( response ){
                $scope.showPitchesResponse = true;
                $scope.pitchResponse = response;
                if(response.errors) {
                    Materialize.toast('PitchEvaluation could not be destroyed!', 4000, 'red');
                    return;
                }
                Materialize.toast('Pitch has been destroyed!', 4000, 'green');
            });
        }// destroyEvaluation


        /*********************
         HELPER FUNCTIONS
        *********************/
        
        function fetchAgencies(){
            AgencyService.getAll( function( agencies ){
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
                $scope.skills = skills;
            }); 
        }// fetchSkills

        function fetchCompanies(){
            CompanyService.getAll( function( response ){
                $scope.companies = response.companies;
            }); 
        }// fetchCompanies

        function fetchBrands(){
            CompanyService.getBrands( function( response ){
                $scope.brands = response.brands;
            }); 
        }// fetchBrands

        function fetchPitches(){
            PitchService.getAll( function ( response ){
                $scope.pitches = response.pitches;
            });
        }

        function fetchCriteria(){
            AgencyService.getCriteria( function( response ){
                $scope.criteria = response.criteria;
            }); 
        }// fetchCriteria

        function setCollectionInactive(tab){
            $('.collection-item').removeClass('active');
            $scope.isNewUserRequests = false;
            $scope.isUsers = false;
            $scope.isSessions = false;
            $scope.isAgencies = false;
            $scope.isCases = false;
            $scope.isSkills = false;
            $scope.isCompanies = false;
            $scope.isBrands = false;
            $scope.isPitches = false;
            $scope.isMorePitches = false;
            $scope.isAgencyDashboards = false;
        }

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

        function getCriteriaIds( criteriaArr ){
            idsArr = [];
            $.each( criteriaArr, function(i, val){
                idsArr.push(val.id);
            })
            return idsArr;
        }

    }]);