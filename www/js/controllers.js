angular.module('app.controllers', [])

.controller('DashCtrl', function($scope, YoutubeService, $state){
  $scope.videos = [];
  // when go Dash
  $scope.$on('$ionicView.enter', function(ev) {
    $scope.videos = YoutubeService.getAllVideo();
  })
  // video click
  $scope.videoClick = function(video){
    YoutubeService.setIsSeekToSub(false);
    YoutubeService.setCurSub(null);
    YoutubeService.setCurVideo(video);
  }
});