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

  var findPostIndexById = function(id){
    for(i = 0; i < posts.length; i++){
      if(posts[i]._id === id){
        return i;
      }
    }
  }

  getposts();

  return {
    subscribePostsChange: function(scope, callback){
     var handler = $rootScope.$on('posts-change-event', callback);
     scope.$on('destroy', handler);
    },

    subscribePostsComment: function(scope, callback){
      var handler = $rootScope.$on('post-comment-event', callback);
      scope.$on('destroy', handler);
    },

    sendPost: function(post, token){
      $http.post('/post', post, {headers: {Authorization: 'Bearer ' + token}}).then(function(res){
        posts.push(res.data);
        $rootScope.$emit('posts-change-event');
      }, function(error){
        console.log(error);
      });
    },

    givePosts: function(){
      return posts;
    },

    givePost: function(id){
      return posts[findPostIndexById(id)];
    },

    addComment: function(postId, userId, comment, token){
      $http.post('/comment/' + postId + '/' + userId, comment, {headers: {Authorization: 'Bearer ' + token}}).then(function(res){
        posts[findPostIndexById(postId)].comments.push(res.data);
        $rootScope.$emit('post-comment-event');
      }, function(error){
        console.log(error);
      })
    },

    givePostComments: function(id){
      return posts[findPostIndexById(id)].comments;
    },

    upvote: function(id, token){
      $http.put('/post/' + id + '/upvote', {}, {headers: {Authorization: 'Bearer ' + token}}).then(function(res){
        posts[findPostIndexById(id)].upvotes++;
        $rootScope.$emit('posts-change-event');
      }, function(err){
        console.log(err);
      })
    }
  };
});