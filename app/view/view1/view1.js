'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view/view1/view1.html',
    controller: 'View1Ctrl',
    resolve: {
      // controller will not be loaded until $waitForAuth resolves
      // Auth refers to our $firebaseAuth wrapper in the example above
      "currentAuth": ["Auth", function(Auth) {
        // $waitForAuth returns a promise so the resolve waits for it to complete
        return Auth.$requireAuth();
        // return Auth.$waitForAuth();
      }]
    }
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