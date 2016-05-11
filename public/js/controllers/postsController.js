app.controller('PostsCtrl', ['$scope', 'posts', '$stateParams', function($scope, posts, $stateParams) {
  $scope.post = posts[$stateParams.index];
  $scope.commentTitle = '';
  $scope.commenter = '';

  $scope.addComment = function(){
    var comment = {
      title: $scope.commentTitle,
      commenter: $scope.commenter
    }

    $scope.post.comments.push(comment);
    console.log(posts[$stateParams.index])
  };
}]);