app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts){
  $scope.posts = posts;
  $scope.title = '';
  $scope.link = '';

  $scope.addPost = function(){
    var post = {
      title: $scope.title,
      link: $scope.link,
      upvotes: 0,
      comments: []
    };
    $scope.posts.push(post);
  };

  $scope.incrementUpvotes = function(post){
    post.upvotes++;
  }
}]);