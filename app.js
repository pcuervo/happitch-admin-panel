// Assets
window.amapAssets = function(get) {
    var list = {

        sparkline: [
            'assets/sparkline/jquery.sparkline.min.js',
            'assets/angularjs-sparkline/angularjs.sparkline.js'
        ],

        flot: [
            'assets/flot/jquery.flot.min.js',
            'assets/flot/jquery.flot.time.min.js',
            'assets/flot/jquery.flot.pie.min.js',
            'assets/flot/jquery.flot.tooltip.min.js',
            'assets/flot/jquery.flot.categories.min.js',
            'assets/angularjs-flot/angular-flot.js'
        ],

        nvd3: [
            'assets/d3/d3.min.js',
            'assets/nvd3/nv.d3.min.css',
            'assets/nvd3/nv.d3.min.js',
            'assets/angularjs-nvd3/angular-nvd3.min.js'
        ],

        rickshaw: [
            //'https://d3js.org//d3.v3.min.js',
            'assets/d3/d3.min.js',
            'assets/rickshaw/rickshaw.min.css',
            'assets/rickshaw/rickshaw.min.js',
            'assets/angularjs-rickshaw/rickshaw-angularjs.js'
        ],

        markitup: [
            'assets/markitup/skins/_con/style.css',
            'assets/markitup/sets/default/style.css',
            'assets/markitup/sets/default/set.js',
            'assets/markitup/jquery.markitup.js'
        ],

        ckeditor: ['assets/ckeditor/ckeditor.js'],

        select2: [
            'assets/select2/css/select2.min.css',
            'assets/select2/js/select2.full.min.js'
        ],

        tagsinput: [
            'assets/jquery-tags-input/jquery.tagsinput.css',
            'assets/jquery-tags-input/jquery.tagsinput.js'
        ],

        dropzone: [
            'assets/dropzone/dropzone.min.css',
            'assets/dropzone/dropzone.min.js'
        ],

        clockpicker:[
            'assets/jquery-clockpicker/jquery-clockpicker.min.css',
            'assets/jquery-clockpicker/jquery-clockpicker.min.js'
        ],

        pikaday: [
            'assets/pikaday/pikaday.css',
            'assets/pikaday/pikaday.js',
            'assets/pikaday/pikaday.jquery.js'
        ],

        spectrum: [
            'assets/spectrum/spectrum.css',
            'assets/spectrum/spectrum.js'
        ],

        inputmask: ['assets/jquery-input-mask/jquery.inputmask.bundle.min.js'],

        parsley: ['assets/parsley/parsley.min.js'],

        gmaps: ['assets/gmaps/gmaps.min.js'],
        geoAutocomplete: ['assets/geo-autocomplete/geo-autocomplete.js'],

        jvectormap: [
            'assets/jquery-jvectormap/jquery-jvectormap.css',
            'assets/jquery-jvectormap/jquery-jvectormap.min.js',
            'assets/jquery-jvectormap/jquery-jvectormap-world-mill-en.js',
            'assets/jquery-jvectormap/gdp-data.js',
            'assets/angulajs-jvectormap/angularjs-jvectormap.js'
        ],

        dataTables: [
            'assets/dataTables/js/jquery.dataTables.min.js',
            'assets/dataTables/extensions/TableTools/js/dataTables.tableTools.min.js',
            'assets/dataTables/extensions/Scroller/js/dataTables.scroller.min.js',
            'assets/angularjs-dataTables/angular-datatables.min.js',
            'assets/angularjs-dataTables/plugins/responsive/angular-datatables.responsive.min.js',
            'assets/angularjs-dataTables/plugins/responsive/angular-datatables.responsive.css'
        ],

        fullcalendar: [
            'assets/fullcalendar/fullcalendar.min.css',
            'assets/fullcalendar/moment.min.js',
            'assets/fullcalendar/jquery-ui.custom.min.js',
            'assets/fullcalendar/fullcalendar.min.js'
        ],

        sortable: ['assets/sortable/Sortable.min.js'],

        wowjs: ['assets/wow.js/wow.min.js'],

        animatecss: ['assets/animate.css/animate.css'],

        photoswipe: [
            'assets/PhotoSwipe/photoswipe.css',
            'assets/PhotoSwipe/default-skin/default-skin.css',
            'assets/PhotoSwipe/photoswipe.min.js',
            'assets/PhotoSwipe/photoswipe-ui-default.min.js'
        ],

        isotope: ['assets/isotope/isotope.pkgd.min.js'],

        videojs: [
            'assets/video.js/video-js.css',
            'assets/video.js/video.js',
            'assets/video.js/plugins/vjs.youtube.js',
            'assets/video.js/plugins/media.vimeo.js'
        ],

    };

    // return result array
    var get = get.split(',');
    var result = [];
    for(var k in get) {
        if(typeof list[ get[k] ] !== 'undefined') {
            for(var n in list[ get[k] ]) result.push( list[ get[k] ][n] );
        }
    }

    return result;
}// window.amapAssets get()


/*
 * Con AngularJS Version
 */
var conAngular =
    angular.module("conAngular", [
        "ui.router",
        "ui.materialize",
        "oc.lazyLoad",
        "ngSanitize",
        "ngCookies",
        "datatables",
    ]);

// Config ocLazyLoader
conAngular.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
    // lazy load config
    });
}]);

// App Controller
conAngular.controller('AppController', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {
    $scope.$on('$viewContentLoaded', function() {
        // init plugins
        conApp.initPlugins();
        conApp.initCards();
        conApp.initCardTodo();
    });
}]);

// Setup Rounting For All Pages
conAngular.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard");

    // pages
    $stateProvider
    // Login
    .state('/login', {
        url: "/login",
        templateUrl: "authentication/login.html",
        controller: "LoginController",
        data: {
            pageTitle: 'Login'
        }
    })
    // Dashboard
    .state('/dashboard', {
        url: "/dashboard",
        templateUrl: "dashboard/dashboard.html",
        controller: "DashboardController",
        data: {
            pageTitle: 'Admin Dashboard Happitch',
            crumbs: [{
                title: '<i class="fa fa-home"></i> Home',
                href: '#'
              }, {
                title: 'Dashboard',
                href: '#/dashboard'
              }]
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    serie: true, // used for synchronous load chart scripts
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('flot')
                }]);
            }]
        } 
    })
    // Logout
    .state('/logout', {
        url: "/logout",
        controller: "LogoutController"
    })
    // User
    .state('/view-user-requests', {
        url: "/view-user-requests",
        templateUrl: "user/view-user-requests.html",
        controller: "UserController",
        data: {
            pageTitle: 'Ver solicitudes pendientes'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables')
                }]);
            }]
        } 
    })
    .state('/view-user-request', {
        url: "/view-user-request/:requestId",
        templateUrl: "user/view-user-request.html",
        controller: "UserController",
        data: {
            pageTitle: 'Ver solicitudes'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('parsley')
                }]);
            }]
        } 
    })
    .state('/add-user', {
        url: "/add-user",
        templateUrl: "user/add-user.html",
        controller: "UserController",
        data: {
            pageTitle: 'Agregar usuario'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('parsley')
                }]);
            }]
        } 
    })
    .state('/add-admin', {
        url: "/add-admin",
        templateUrl: "user/add-admin.html",
        controller: "UserController",
        data: {
            pageTitle: 'Agregar usuario'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('parsley')
                }]);
            }]
        } 
    })
    .state('/view-users', {
        url: "/view-users",
        templateUrl: "user/view-users.html",
        controller: "UserController",
        data: {
            pageTitle: 'Ver usuarios'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables')
                }]);
            }]
        } 
    })
    .state('/view-admin-users', {
        url: "/view-admin-users",
        templateUrl: "user/view-admin-users.html",
        controller: "UserController",
        data: {
            pageTitle: 'Ver usuarios'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables')
                }]);
            }]
        } 
    })
    .state('/delete-user', {
        url: "/delete-user/:userId",
        templateUrl: "user/delete-user.html",
        controller: "UserController",
        data: {
            pageTitle: 'Eliminar usuarios'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables')
                }]);
            }]
        } 
    })

    .state('/api-client', {
        url: "/api-client",
        templateUrl: "api-client/api-client.html",
        controller: "ApiController",
        data: {
            pageTitle: 'API Tester'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('parsley')
                }]);
            }]
        } 
    })
    .state('/reset-password', {
        url: "/reset-password/:passwordToken",
        templateUrl: "user/reset-password.html",
        controller: "UserController",
        data: {
            pageTitle: 'Cambiar contraseña'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('parsley')
                }]);
            }]
        } 
    })
    .state('/create-skill-category', {
        url: "/create-skill-category",
        templateUrl: "agency/create-skill-category.html",
        controller: "AgencyController",
        data: {
            pageTitle: 'Crear categoría de skill',
            crumbs: [{
                title: '<i class="fa fa-home"></i> Home',
                href: '#'
              }, {
                title: 'Dashboard',
                href: '#/create-skill-category'
              }]
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('parsley')
                }]);
            }]
        } 
    })
    .state('/view-skill-categories', {
        url: "/view-skill-categories",
        templateUrl: "agency/view-skill-categories.html",
        controller: "AgencyController",
        data: {
            pageTitle: 'Ver categorías de skills',
            crumbs: [{
                title: '<i class="fa fa-home"></i> Home',
                href: '#'
              }, {
                title: 'Dashboard',
                href: '#/create-skill-category'
              }]
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables')
                }]);
            }]
        } 
    })
   .state('/create-skill', {
        url: "/create-skill",
        templateUrl: "agency/create-skill.html",
        controller: "AgencyController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('parsley')
                }]);
            }]
        } 
    })
   .state('/view-skills', {
        url: "/view-skills",
        templateUrl: "agency/view-skills.html",
        controller: "AgencyController",
        data: {
            pageTitle: 'Ver skills',
            crumbs: [{
                title: '<i class="fa fa-home"></i> Home',
                href: '#'
              }, {
                title: 'Dashboard',
                href: '#/create-skill-category'
              }]
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables')
                }]);
            }]
        } 
    })
    .state('/create-company', {
        url: "/create-company",
        templateUrl: "company/create-company.html",
        controller: "CompanyController",
        data: {
            pageTitle: 'Crear compañía'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('parsley')
                }]);
            }]
        } 
    })
    .state('/view-companies', {
        url: "/view-companies",
        templateUrl: "company/view-companies.html",
        controller: "CompanyController",
        data: {
            pageTitle: 'Ver compañías'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables')
                }]);
            }]
        } 
    })
    .state('/view-company', {
        url: "/view-company/:companyId",
        templateUrl: "company/view-company.html",
        controller: "CompanyController",
        data: {
            pageTitle: 'Ver anunciante'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    serie: true, // used for synchronous load chart scripts
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables,geoAutocomplete,maps,flot')
                }]);
            }]
        } 
    })
    .state('/unify-company', {
        url: "/unify-company/:companyId",
        templateUrl: "company/unify-company.html",
        controller: "CompanyController",
        data: {
            pageTitle: 'Unificar anunciantes'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    serie: true, // used for synchronous load chart scripts
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables')
                }]);
            }]
        } 
    })
    .state('/unify-brand', {
        url: "/unify-brand/:brandId",
        templateUrl: "company/unify-brand.html",
        controller: "CompanyController",
        data: {
            pageTitle: 'Unificar marcas'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    serie: true, // used for synchronous load chart scripts
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables')
                }]);
            }]
        } 
    })
    .state('/create-brand', {
        url: "/create-brand",
        templateUrl: "company/create-brand.html",
        controller: "CompanyController",
        data: {
            pageTitle: 'Crear marca'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('parsley')
                }]);
            }]
        } 
    })
    .state('/view-brands', {
        url: "/view-brands",
        templateUrl: "company/view-brands.html",
        controller: "CompanyController",
        data: {
            pageTitle: 'Ver marcas'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables')
                }]);
            }]
        } 
    })

    .state('/view-agencies', {
        url: "/view-agencies",
        templateUrl: "agency/view-agencies.html",
        controller: "AgencyController",
        data: {
            pageTitle: 'Ver agencias'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables')
                }]);
            }]
        } 
    })
    .state('/view-agency', {
        url: "/view-agency/:agencyId",
        templateUrl: "agency/view-agency.html",
        controller: "AgencyController",
        data: {
            pageTitle: 'Ver agencia'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    serie: true, // used for synchronous load chart scripts
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables,geoAutocomplete,maps,flot')
                }]);
            }]
        } 
    })
    .state('/add-agency', {
        url: "/add-agency",
        templateUrl: "agency/add-agency.html",
        controller: "AgencyController",
        data: {
            pageTitle: 'Crear agencia'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('parsley')
                }]);
            }]
        } 
    })

    // Pitches
    .state('/view-pitches', {
        url: "/view-pitches",
        templateUrl: "pitch/view-pitches.html",
        controller: "PitchController",
        data: {
            pageTitle: 'Ver pitches'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables')
                }]);
            }]
        } 
    })
    .state('/view-pitch', {
        url: "/view-pitch/:pitchId",
        templateUrl: "pitch/view-pitch.html",
        controller: "PitchController",
        data: {
            pageTitle: 'Ver pitch'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    serie: true, // used for synchronous load chart scripts
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('dataTables')
                }]);
            }]
        } 
    })
    .state('/merge-pitch-companies', {
        url: "/merge-pitch-companies",
        templateUrl: "pitch/merge-pitch-companies.html",
        controller: "PitchController",
        data: {
            pageTitle: 'Pitches por compañía'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('parsley')
                }]);
            }]
        } 
    })

    .state('/merge-pitch-brands', {
        url: "/merge-pitch-brands/:brandId",
        templateUrl: "pitch/merge-pitch-brands.html",
        controller: "PitchController",
        data: {
            pageTitle: 'Pitches por marca'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('parsley')
                }]);
            }]
        } 
    })

    .state('/compare-pitches', {
        url: "/compare-pitches/:pitches",
        templateUrl: "pitch/compare-pitches.html",
        controller: "PitchController",
        data: {
            pageTitle: 'Comparar pitches'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'conAngular',
                    insertBefore: '#ngInsertBefore',
                    files: amapAssets('parsley')
                }]);
            }]
        } 
    })
}]);

/* Init global settings and run the app */
conAngular.run(['$rootScope', '$state', '$location', '$cookies', '$http', 'AuthenticationService', function($rootScope, $state, $location, $cookies, $http, AuthenticationService) {
    // Set Environment
    $rootScope.env = 'prod';
    // API URL
    var test = 'http://localhost:3000/api/';
    var stage = 'https://amap-dev.herokuapp.com/api/'
    var prod = 'https://amap-prod.herokuapp.com/api/'
    if( 'test' == $rootScope.env ){
        $rootScope.apiUrl = test;
        $rootScope.apiKey = 'Token dcfbad63799d40cb13300c347665cb36';
        $http.defaults.headers.common['Authorization'] = 'Token dcfbad63799d40cb13300c347665cb36'; 
    } else if ( 'stage' == $rootScope.env ){
        $rootScope.apiUrl = stage;
        $rootScope.apiKey = 'Token 40e97aa81c2be2de4b99f1c243bec9c4';
        $http.defaults.headers.common['Authorization'] = 'Token 40e97aa81c2be2de4b99f1c243bec9c4';
    } else {
        $rootScope.apiUrl = prod;
        $rootScope.apiKey = 'Token 732f80decfc02b204a53e2480e5b7ec5';
        $http.defaults.headers.common['Authorization'] = 'Token 732f80decfc02b204a53e2480e5b7ec5';
    }
    
    $rootScope.loggedIn = $cookies.get('loggedIn') == 'true' ? true : false;
    // state to be accessed from view
    $rootScope.$state = $state;
    // keep user logged in after page refresh
    $rootScope.globals = $cookies.getObject('globals') || {};

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        $rootScope.loggedIn = $cookies.get('loggedIn') == 'true' ? true : false;
        if( typeof $rootScope.globals.currentUser != 'undefined' ){
            AuthenticationService.isLoggedIn( $rootScope.globals.currentUser.authdata, function( response ){

                if( response.errors ){
                    Materialize.toast('¡Tu sesión ha expirado, por favor ingresa nuevamente!', 4000, 'red');
                    event.preventDefault();
                    $state.go('/login');
                    return;
                }
                
                $rootScope.loggedIn = true;
            } );
        } else {
            $rootScope.loggedIn = false;
        }

        if ( ! $rootScope.loggedIn && next.indexOf('api-client') < 1 && next.indexOf('reset-password') < 1 ) {
            event.preventDefault();
            $state.go('/login');
        }
    });

}]);


var ErrorHelper = ErrorHelper || {};
ErrorHelper = {
    display: function( errors ){
        angular.forEach( errors, function( error, field ){
            Materialize.toast( field + ': ' + error, 4000, 'red');
        })
    }
};

var FormatHelper = FormatHelper || {};
FormatHelper = {
    slug: function( text ){
        return text.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,' ');
    },
    dateYMD: function( date, separator ){
        var dd = date.getDate();
        var mm = date.getMonth()+1;
        var yyyy = date.getFullYear();

        if( dd<10 ) dd = '0' + dd;
        if( mm<10 ) mm = '0' + mm;

        var date = yyyy + separator + mm + separator+ dd;
        return date;
    }
};

var LoaderHelper = LoaderHelper || {};
LoaderHelper = {
    showLoader: function( message ){
        var loader = document.getElementById('loader');
        loader.className = loader.className.replace( /(?:^|\s)hide(?!\S)/g , '' );
        loader.getElementsByTagName('p')[0].innerHTML = message;
    },
    hideLoader: function(){
        var loader = document.getElementById('loader');
        loader.className += ' hide';
    }
}

var NotificationHelper = NotificationHelper || {};
NotificationHelper = {
    updateNotifications: function( numNotifications ){ $('.notification-menu span').text( numNotifications ); }
}
