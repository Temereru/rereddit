var app = angular.module('redditFun', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){

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
});