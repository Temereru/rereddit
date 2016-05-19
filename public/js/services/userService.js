module.exports = function($http, $window, $rootScope){
  
  var loggedIn = false;
  var _setJWT = function(token){
    $window.localStorage['passportJWT'] = token;
  };

  var _clearJWT = function(){
    $window.localStorage.removeItem('passportJWT');
  };

  var getToken = function(){ 
    return $window.localStorage['passportJWT'];
  };

  var parseToken = function(){
    var token = getToken();
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse($window.atob(base64));
  }

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
      jwtObj = parseToken();
      currentUser.userId = jwtObj._id;
      currentUser.username = jwtObj.username;
      loggedIn = true;
      $rootScope.$emit('user-change-event');
    }
  };

  if(getToken()){
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

    subscribeFacebookSuccess: function(scope, callback){
      var handler = $rootScope.$on('facebook-successfull-event', callback);
      scope.$on('$destroy', handler);
    },

    subscribeGooglePlusSuccess: function(scope, callback){
      var handler = $rootScope.$on('google-plus-successfull-event', callback);
      scope.$on('$destroy', handler);
    },

    register: function(user){
      $http.post('/user/register', user).then(function(response){
        if(response.data.token){
            _setJWT(response.data.token);
            setCurrentUser(false);
            $state.go('home');
        }      
      }, function(err){
        console.log(err);
      });
    },

    login: function(user){
      $http.post('/user/login', user).then(function(response){
        if(response.data.token){
          _setJWT(response.data.token);
          setCurrentUser(false);
          $state.go('home');
        }
      }, function(err){
        console.log(err);
      })
    },

    logout: function(){
      _clearJWT();
      setCurrentUser(true);
      $state.go('home');
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
      return parseToken();
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
      $window.open('/user/connectFacebook', '_self');
    },

    setFacebookId: function(id){
      $http.put('/user/connectFacebook/setFacebookId/' + currentUser.userId, {facebookId: id}, {headers: {Authorization: 'Bearer ' + getToken()}}).then(function(res){
        $rootScope.$emit('facebook-successfull-event');
      }, function(err){
        console.log(err);
      })
    },

    loginWithFacebook: function(){
      $window.open('/user/loginFacebook', '_self');
    },

    loginFacebookId: function(scope, id){
      $http.get('user/loginFacebook/loginFacebookId/' + id).then(function(res){
        if(res.data.token){
          _setJWT(res.data.token);
          setCurrentUser(false);
          $state.go('home');
        }
      }, function(err){
        scope.errMsg = 'You need to first register and connect you profile with a facebook account';
        scope.showErrMsg = true;
      })
    },

    connectGooglePlus: function(id){
      $window.open('/user/connectGooglePlus', '_self');
    },

    setGooglePlusId: function(id){
      $http.put('/user/connectGooglePlus/setGooglePlusId/' + currentUser.userId, {googlePlusId: id}, {headers: {Authorization: 'Bearer ' + getToken()}}).then(function(res){
        $rootScope.$emit('google-plus-successfull-event');
      }, function(err){
        console.log(err);
      });
    },

    loginWithGooglePlus: function(){
      $window.open('/user/loginGooglePlus', '_self');
    },

    loginGooglePlusId: function(scope, id){
      $http.get('user/loginGooglePlus/loginGooglePlusId/' + id).then(function(res){
        if(res.data.token){
          _setJWT(res.data.token);
          setCurrentUser(false);
          $state.go('home');
        }
      }, function(err){
        scope.errMsg = 'You need to first register and connect you profile with a Google+ account';
        scope.showErrMsg = true;
      });
    }
  };
};