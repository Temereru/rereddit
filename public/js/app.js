require('angular');
require('angular-ui-router');

var posts = require('./services/posts');
var userService = require('./services/userService');
var mainCtrl = require('./controllers/mainController');
var dashboardCtrl = require('./controllers/dashboardController');
var navCtrl = require('./controllers/navController');
var postsCtrl = require('./controllers/postsController');
var userCtrl = require('./controllers/userController');

angular.module('redditFun', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'MainCtrl',
      templateUrl: 'js/templates/home.html'
    });
  $stateProvider
    .state('post', {
      url: '/post/:id',
      controller: 'PostsCtrl',
      templateUrl: 'js/templates/post.html',
    });
    $stateProvider
    .state('signup', {
      url: '/signup',
      controller: 'UserCtrl',
      templateUrl: 'js/templates/signup.html',
    });
    $stateProvider
    .state('login', {
      url: '/login',
      controller: 'UserCtrl',
      templateUrl: 'js/templates/login.html',
    });
    $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      controller: 'DashboardCtrl',
      templateUrl: 'js/templates/dashboard.html',
    });
    $stateProvider
    .state('dashboard.details', {
      url: '/details',
      templateUrl: 'js/templates/dashboard-details.html',
    });
    $stateProvider
    .state('dashboard.settings', {
      url: '/settings',
      templateUrl: 'js/templates/dashboard-settings.html',
    });
    $stateProvider
    .state('dashboard.posts', {
      url: '/posts',
      templateUrl: 'js/templates/dashboard-posts.html',
    });
  })
    .factory('posts', posts)
    .factory('UserServ', userService)
    .controller('MainCtrl', ['$scope', 'posts', 'UserServ', mainCtrl])
    .controller('DashboardCtrl', ['$scope', 'UserServ', '$location', dashboardCtrl])
    .controller('NavCtrl', ['$scope', 'UserServ', navCtrl])
    .controller('PostsCtrl', ['$scope', 'posts', '$stateParams', 'UserServ', postsCtrl])
    .controller('UserCtrl', ['$scope', 'UserServ', '$location', userCtrl]);