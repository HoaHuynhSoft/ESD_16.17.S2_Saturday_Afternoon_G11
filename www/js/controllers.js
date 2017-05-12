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
})
.controller('RecentCtrl', function($scope, YoutubeService,$ionicPopup){
  $scope.videos = [];
  $scope.searchStr = '';
  $scope.resultVideo = {};
  $scope.resultSub = {};
  $scope.filterStr = '';
  $scope.isSearched = false;
  $scope.isFounded = false;
   $scope.$on('$ionicView.enter', function(ev) {
     $scope.loadAll();
   });
  $scope.loadAll = function(){
    YoutubeService.getAllRecent().then(
      function(res){
        $scope.videos = res;
    },function(err){
    }
    );
  }
  $scope.clearRecent = function(){
    var confirmPopup = $ionicPopup.confirm({
       title: 'Clear All Recent',
       template: 'Are you sure to remove all recent videos ?'
     });
     confirmPopup.then(function(res) {
       if(res) {
        YoutubeService.clearRecent();
      $scope.videos = [];
       } else {
       }
     });
     
  }
  $scope.remove = function(item){
    YoutubeService.deleteRecentVideo(item.id);
    $scope.videos.splice($scope.videos.indexOf(item), 1);
  }
  $scope.search = function(){
    if($scope.isSearched)
    {
      $scope.searchStr = '';
      $scope.isSearched = false;
      $scope.filterStr = '';
      $scope.isFounded = false;
      return;
    }
    isFounded = false;
    var BreakException = {};
    try{
      $scope.videos.forEach(function(item, index) {
        var subArr = JSON.parse(item.sub);
        subArr.forEach(function(subItem, subIndex) {   
          console.log(subItem.__text.toLowerCase());
          if (subItem.__text.toLowerCase().indexOf($scope.searchStr.toLowerCase()) >-1){          
            isFounded = true;                       
            $scope.resultVideo = item;
            $scope.resultSub = subItem;
            throw BreakException;
          }     
        });
      });
    } catch (e) {
    }
    $scope.isSearched = true;
     if(isFounded){
      $scope.filterStr = $scope.resultVideo.id;
      }
      else{
        $scope.filterStr = $scope.searchStr;
      }
      console.log($scope.filterStr);
  }
  $scope.searchChange = function(){
    $scope.isSearched = false;
    $scope.isFounded = false;
  }
  $scope.videoClick = function(video){
    if($scope.isSearched)
    {
      console.log ('seek to sub');
      var tempVideo = $scope.resultVideo;
      delete tempVideo['sub'];
      YoutubeService.setIsSeekToSub(true);
      YoutubeService.setCurSub($scope.resultSub);
      YoutubeService.setCurVideo(tempVideo);
    }
    else
    {
      console.log (' non seek to sub');      
      var tempVideo = video;
      delete tempVideo['sub'];
      YoutubeService.setIsSeekToSub(false);
      YoutubeService.setCurSub(null);
      YoutubeService.setCurVideo(tempVideo);
    }
  }
});