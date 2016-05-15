app.factory('UserServ', function($http, $window, $rootScope, $location, $window){
  
  var loggedIn = false;
  var _setJWT = function(token){
    localStorage['passportJWT'] = token;
  };

  var _clearJWT = function(){
    localStorage.removeItem('passportJWT');
  };

  var currentUser = {
    userId: '',
    username: ''
  };

  var userPosts = [];
  
  setCurrentUser = function(remove){
    if(remove){
      currentUser = {
        userId: '',
        username: ''
      };
      userPosts = [];
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
  };

  getToken = function(){ 
    return localStorage['passportJWT'];
  };

  if(localStorage['passportJWT']){
    setCurrentUser(false);
  };

  return {
    subscribeUserChange: function(scope, callback){
      var handler = $rootScope.$on('user-change-event', callback);
      scope.$on('$destroy', handler);
    },

    subscribeUserPosts: function(scope, callback){
      var handler = $rootScope.$on('user-posts-event', callback);
      scope.$on('$destroy', handler);
    },

    subscribePasswordChange: function(scope, callback){
      var handler = $rootScope.$on('password-successfull-change-event', callback);
      scope.$on('$destroy', handler);
    },

    register: function(user){
      $http.post('/register', user).then(function(response){
        if(response.data.token){
            _setJWT(response.data.token);
            setCurrentUser(false);
            $location.url('/');
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
          $location.url('/');
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
    },

    getToken: getToken,

    getFullUserData: function(){
      var token = localStorage['passportJWT'];
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    },

    getUserPosts: function(id){
      $http.get('/user/getPosts/' + id).then(function(res){
        userPosts = res.data;
        $rootScope.$emit('user-posts-event');
      }, function(err){
        console.log(err);
      })
    },

    giveUserPosts: function(){
      return userPosts;
    },

    changeProfilePicture: function(id, url){
      $http.put('/user/changeProfilePicture/' + id, {url: url}, {headers: {Authorization: 'Bearer ' + getToken()}}).then(function(res){
        _setJWT(res.data.token);
        setCurrentUser(false);
      }, function(err){
        console.log(err);
      })
    },

    changeEmail: function(id, email){
      $http.put('/user/changeEmail/' + id, {email: email}, {headers: {Authorization: 'Bearer ' + getToken()}}).then(function(res){
        _setJWT(res.data.token);
        setCurrentUser(false);
      }, function(err){
        console.log(err);
      })
    },

    changePassword: function(id, oldPass, newPass){
      $http.put('/user/changePassword/' + id, {oldPass: oldPass, newPass: newPass}, {headers: {Authorization: 'Bearer ' + getToken()}}).then(function(res){
        $rootScope.$emit('password-successfull-change-event');
      }, function(err){
        console.log(err);
      })
    },

    connectFacebook: function(id){
      $window.open('/user/connectFacebook', '_self')
      // $http.get('/user/connectFacebook/', {headers: {Authorization: 'Bearer ' + getToken()}}).then(function(res){

      // }, function(err){
      //   console.log(err);
      // })
    }
  };
});