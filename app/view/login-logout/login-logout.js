'use strict';

angular.module('myApp.login-logout', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'view/login-logout/login-logout.html',
    //controller: 'login-logout',
  });
}])

.controller('View1Ctrl', ['$scope', '$firebaseObject', function($scope, $firebaseObject) {

  var ref = new Firebase("https://renan-app.firebaseio.com/results");
  // download the data into a local object
  var syncObject = $firebaseObject(ref);
  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
  // data is the model to define in the view and that will contain the data
  syncObject.$bindTo($scope, "data");
  // console.log(syncObject);

}]);