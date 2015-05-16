angular.module('codeColab.deploy', [])

.controller('deployCtrl', function ($scope, Share) {


  $scope.deploy = 'DEPLOYING!!!';
  $scope.first = true;

  $scope.checkForApp = function() {
    Share.checkForApp($scope, localStorage.repo)
  }

  $scope.deployApp = function(){
    var validName = false;
    var name;

      if ($scope.first) {
        bootbox.prompt("What would you like to name your app?", function (enterName) {
          name = enterName
          $scope.first = false;
          validName = Share.checkName(name)
          if (validName) {
            console.log('validName')
            Share.deployApp($scope, name);
          } else {
            console.log('invalidName')
            $scope.deployApp();
          }
       })
      } else {
        bootbox.prompt("Valid Heroku app names must start with a letter and can only contain lowercase letters, numbers,\
         and dashes. Please enter a valid name.", function (enterName) {
          name = enterName;
          validName = Share.checkName(name)
          if (validName) {
            Share.deployApp($scope, name);
          } else {
            $scope.deployApp();
          }
        })
      }
    }


  $scope.checkForApp();
})
