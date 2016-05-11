app.factory('UserServ', function($http){


  return {
    register: function(user){
      $http.post('/register', user).then(function(response){
        if(response.data.token){
          localStorage['JWT'] = response.data.token;  
        }      
      }, function(error){
        console.log(error);
      });
    }
  }
});