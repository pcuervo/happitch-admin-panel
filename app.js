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
            pageTitle: 'Admin Dashboard with Material Design',
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
                    insertBefore: '#ngInsertBefore', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: amapAssets('sortable')
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
                    insertBefore: '#ngInsertBefore', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: amapAssets('parsley')
                }]);
            }]
        } 
    })

    // API Test
    // User
    // .state('/api-client', {
    //     url: "/api-client/",
    //     templateUrl: "api-client/api-client.html",
    //     controller: "ApiController",
    //     data: {
    //         pageTitle: 'API Tester'
    //     },
    //     resolve: {
    //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //             return $ocLazyLoad.load([{
    //                 name: 'conAngular',
    //                 insertBefore: '#ngInsertBefore', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    //                 files: amapAssets('parsley')
    //             }]);
    //         }]
    //     } 
    // })

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
   
}]);

/* Init global settings and run the app */
conAngular.run(['$rootScope', '$state', '$cookies', '$http', 'AuthenticationService', function($rootScope, $state, $cookies, $http, AuthenticationService) {
    // Set Environment
    $rootScope.env = 'test';
    // API URL
    var test = 'http://localhost:3000/api/';
    var stage = 'http://amap-dev.herokuapp.com/api/'
    var prod = 'amap-prod.herokuapp.com/api/'
    if( 'test' == $rootScope.env ){
        $rootScope.apiUrl = test;
        $rootScope.apiKey = 'Token d2d6279345763f64ce21183142e974b8';
        $http.defaults.headers.common['Authorization'] = 'Token d2d6279345763f64ce21183142e974b8'; 
    } else if ( 'stage' == $rootScope.env ){
        $rootScope.apiUrl = stage;
        $rootScope.apiKey = 'Token 40e97aa81c2be2de4b99f1c243bec9c4';
        $http.defaults.headers.common['Authorization'] = 'Token 40e97aa81c2be2de4b99f1c243bec9c4';
    } else {
        $rootScope.apiUrl = prod;
        $rootScope.apiKey = 'Token 40e97aa81c2be2de4b99f1c243bec9c4';
        $http.defaults.headers.common['Authorization'] = 'Token 40e97aa81c2be2de4b99f1c243bec9c4';
    }
    
    $rootScope.loggedIn = $cookies.get('loggedIn') == 'true' ? true : false;
    // state to be accessed from view
    $rootScope.$state = $state;
    // keep user logged in after page refresh
    $rootScope.globals = $cookies.getObject('globals') || {};

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
