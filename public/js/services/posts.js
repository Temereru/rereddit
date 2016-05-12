app.factory('posts', function($http, $rootScope){
  var posts = [];

  var getposts = function(){
    $http.get('/posts').then(function(res){
      posts = res.data;
      $rootScope.$emit('posts-change-event');
    }, function(error){
      console.log(error);
    });
  };

  getposts();

  return {
    subscribePostsChange: function(scope, callback){
     var handler = $rootScope.$on('posts-change-event', callback);
     scope.$on('destroy', handler);
    },

    sendPost: function(post){
      $http.post('/post', post).then(function(res){
        posts.push(res.data);
        $rootScope.$emit('posts-change-event');
      }, function(error){
        console.log(error);
      });
    },

    givePosts: function(){
      return posts;
    }
  };
});