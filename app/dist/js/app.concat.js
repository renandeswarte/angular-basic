'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'firebase',
  'myApp.authentification',
  'myApp.homepage',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myApp.login-logout'
])

// .config(['$routeProvider', function($routeProvider) {
//   $routeProvider.otherwise({redirectTo: '/'});
// }])

.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/login");
    }
  });
}])

.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})

;

;'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp.authentification', [
  'firebase'
])

.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://renan-app.firebaseio.com");
    // console.log("Auth ref : ", ref);
    return $firebaseAuth(ref);
  }
])

.controller("authTest", ["$scope", "Auth", "$firebaseObject", "$location",  
  function($scope, Auth, $firebaseObject, $location) {
    $scope.auth = Auth;

    // any time auth status updates, add the user data to scope
    Auth.$onAuth(function(authData) {
      if (authData) {
        var ref = new Firebase("https://renan-app.firebaseio.com/");
        var userInfo = $firebaseObject(ref.child('users').child(authData.uid));

        $scope.authData = userInfo;
        // console.log("userinfo: ", $scope.authData);
        // console.dir(authData);
      }
    });

    $scope.logout = function() { 
        Auth.$unauth();
        $scope.authData = false;
    };
  }
])

// and use it in our controller
.controller("authController", ["$scope", "Auth", '$location', '$firebaseObject',
  function($scope, Auth, $location, $firebaseObject) {
    $scope.createUser = function() {
      $scope.message = null;
      $scope.error = null;

      Auth.$createUser({
        email: $scope.email,
        password: $scope.password
      }).then(function(userData) {
        $scope.message = "User created with uid: " + userData.uid;

        var ref = new Firebase("https://renan-app.firebaseio.com/users/" + userData.uid);
        // var profileRef = ref.child(user);
        var user = $firebaseObject(ref);
        
        user.firstname = $scope.firstname;
        user.lastname = $scope.lastname;
        user.email = $scope.email;
        user.uid = userData.uid;
        // $save does not create a unique id, instead of push()
        user.$save().then(function() {
            console.log('user saved!');
          }).catch(function(error) {
            console.log('Error!');
        });

        // Auto login after signup
        Auth.$authWithPassword({
          email: $scope.email,
          password: $scope.password
        }).then(function(authData) {
          // console.log("Logged in as:", authData.uid);
          // Redirect to main page after login
          $location.path("/view1");
        }).catch(function(error) {
          console.error("Authentication failed:", error);
          $scope.error = error;
        });

      }).catch(function(error) {
        $scope.error = error;
      });
    };

    $scope.removeUser = function() {
      $scope.message = null;
      $scope.error = null;

      Auth.$removeUser({
        email: $scope.email,
        password: $scope.password
      }).then(function() {
        $scope.message = "User removed";
      }).catch(function(error) {
        $scope.error = error;
      });
    };
  }
])

.controller("login", ["$scope", "Auth", '$location', 
  function($scope, Auth, $location) {

    $scope.login = function() {
      $scope.authData = null;
      $scope.error = null;

      Auth.$authWithPassword({
        email: $scope.email,
        password: $scope.password
      }).then(function(authData) {
        // console.log("Logged in as:", authData.uid);
        // Redirect to main page after login
        $location.path("/view1");
      }).catch(function(error) {
        console.error("Authentication failed:", error);
        $scope.error = error;
      });
    };
  }
])


;

;'use strict';

angular.module('myApp.homepage', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'view/home/home.html',
    controller: 'homepage',
  });
}])

.controller('homepage', ['$scope', '$firebaseObject', function($scope, $firebaseObject) {

  var ref = new Firebase("https://renan-app.firebaseio.com/results");
  // download the data into a local object
  var syncObject = $firebaseObject(ref);
  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
  // data is the model to define in the view and that will contain the data
  syncObject.$bindTo($scope, "data");
  console.log(syncObject);

}]);;'use strict';

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

}]);;'use strict';

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

}]);;'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view/view2/view2.html',
    controller: 'View2Ctrl',
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

.controller('View2Ctrl', [function() {

}]);