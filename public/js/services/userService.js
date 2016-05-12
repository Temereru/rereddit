app.factory('UserServ', function($http, $window, $rootScope, $location){
  
  var loggedIn = false;
  var _setJWT = function(token){
    localStorage['passportJWT'] = token;
  }

  var _clearJWT = function(){
    localStorage.removeItem('passportJWT');
  }

  var currentUser = {
    userId: '',
    username: ''
  }
  

  setCurrentUser = function(remove){
    if(remove){
      currentUser = {
        userId: '',
        username: ''
      };
      loggedIn = false;
      $rootScope.$emit('user-change-event');
    }else{
      var token = localStorage['passportJWT'];
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      jwtObj = JSON.parse($window.atob(base64));
      currentUser.userId = jwtObj._id;
      currentUser.username = jwtObj.username;
      loggedIn = true;
      $rootScope.$emit('user-change-event');
    }
  }

  if(localStorage['passportJWT']){
    setCurrentUser(false);
  }

  return {
    subscribeUserChange: function(scope, callback){
      var handler = $rootScope.$on('user-change-event', callback);
      scope.$on('$destroy', handler);
    },

    register: function(user){
      $http.post('/register', user).then(function(response){
        if(response.data.token){
            _setJWT(response.data.token);
            setCurrentUser(false);
        }      
      }, function(err){
        console.log(err);
      });
    },

    login: function(user){
      $http.post('/login', user).then(function(response){
        if(response.data.token){
          _setJWT(response.data.token);
          setCurrentUser(false);
        }
      }, function(err){
        console.log(err);
      })
    },

    logout: function(){
      _clearJWT();
      setCurrentUser(true);
      $location.url('/');
    },

    getUsername: function(){
      return currentUser.username;
    },

    getUserId: function(){
      return currentUser.userId;
    },

    isLogged: function(){
      return loggedIn;
    }
  }
});