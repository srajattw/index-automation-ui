
/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', ['ngRoute','ngGrid']);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html"})
    // Pages
    .when("/methodology", {templateUrl: "partials/methodology.html", controller: "MethodologyCtrl"})
    .when("/indexConfig", {templateUrl: "partials/indexConfig.html", controller: "IndexConfigurationCtrl"})
    .when("/calculate", {templateUrl: "partials/calculateIndex.html", controller: "IndexSearchCtrl"})


    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);


/**
 * Controls all other Pages
 */
app.controller('IndexConfigurationCtrl', function ( $scope, $location, $http) {
  console.log("IndexConfigurationCtrl reporting for duty.");


               $scope.methodology1 = {};
               $scope.index = {};
               $scope.methodology = {};
               $scope.isValid = false;
                   $scope.message = "";

               $scope.update = function(){
                    $scope.methodology1 = JSON.parse($scope.methodology);
                    console.log($scope.methodology1.attributes[0].name);
               }


               $scope.methodologies = []

               $http({
                       method: 'GET',
                       url: 'http://localhost:8080/getMethodologies',

                   }).success(function (result) {
                        $scope.methodologies =  result;
               });


                $scope.submitForm = function(){

                     console.log($scope.methodology1);

                     $scope.isValid = true;
                     $scope.message = "";

                     $scope.index.methodology =  $scope.methodology1;

                     $http({
                         method : 'POST',
                         url : 'http://localhost:8080/saveIndexConfig',
                         data : $scope.index ,
                         headers : {'Content-Type':'application/json'}
                     })

                     .success(function(data){
                         if(data.errors){
                             console.log(data.errors);
                         }else{
                            console.log(data);
                         }

                         $scope.isValid = false;
                         $scope.message = "Index Saved !";
                     })

               }

               $scope.setMethodology = function(m){
                    $scope.index.methodology = m;
               }

});

app.directive('dynamicName',function($compile){
    return {
        restrict:"A",
        terminal:true,
        priority:1000,
        link:function(scope,element,attrs){
            element.attr('name', scope.$eval(attrs.dynamicName));
            element.attr('id', scope.$eval(attrs.dynamicId));

            element.removeAttr("dynamic-name");
            element.removeAttr("dynamic-id");

            $compile(element)(scope);
        }
    }});


/**
 * Controls all other Pages
 */
app.controller('MethodologyCtrl', function ( $scope, $location, $http) {

  console.log("MethodologyCtrl reporting for duty.");
  $scope.methodology = {}
  $scope.methodology.attributes = []
    $scope.isValid = false;
    $scope.message = "";



                  $scope.submitForm = function(){
                       $scope.isValid = true;
                       $scope.message = "";
                       $http({
                           method : 'POST',
                           url : 'http://localhost:8080/saveMethodologyDefinition',
                           data : $scope.methodology ,
                           headers : {'Content-Type':'application/json'}

                       })

                       .success(function(data){
                           if(data.errors){
                               console.log(data.errors);
                           }else{
                              console.log(data);
                           }
                           $scope.message = "Methodlogy Saved!!"
                           $scope.isValid = false;
                       })

                  }

                  $scope.removeMethodology = function(m){
                         var index = $scope.methodology.attributes.indexOf(m);
                         $scope.methodology.attributes.splice(index, 1);
                   }


                  $scope.addMethodologyTemplate = function(){
                        $scope.methodology.attributes.push({});
                  }


});


app.controller('IndexSearchCtrl', function($scope,$http) {

    $scope.indices = [];
    $scope.calcStartDate = {};
    $scope.calcEndDate = {};
    $scope.selectedIndices = [];

    $scope.checkAllVal = {};




                $http({
                       method: 'GET',
                           url: 'http://localhost:8080/searchIndices',

                       }).success(function (result) {
                            $scope.indices =  result;
                   });

                     $scope.checkAll = function(last_status_checked) {
                        console.log(last_status_checked);
                       if(!last_status_checked){
                            $scope.selectedIndices = [];
                            for (var i = 0; i < $scope.indices.length; i++) {
                                $scope.indices[i].selected = false;
                            }
                       }else{
                            $scope.selectedIndices = angular.copy($scope.indices);
                            for (var i = 0; i < $scope.indices.length; i++) {
                                $scope.indices[i].selected = true;
                            }
                       }
                     };

                     $scope.setToNull = function() {
                       $scope.user.roles = null;
                     };

                     $scope.submitForm = function (){
                        console.log($scope.selectedIndices);

                        var data = {
                                        indicesToCalculate: $scope.selectedIndices,
                                        startDate: $scope.calcStartDate,
                                        endDate:$scope.calcEndDate
                                    };

                        $http({
                                 method : 'POST',
                                 url : 'http://localhost:8080/calculateIndices',
                                 data : data ,
                                 headers : {'Content-Type':'application/json'}
                             })

                             .success(function(response){
                                 if(response.errors){
                                     console.log(response.errors);
                                 }else{
                                    console.log(response);
                                 }


                             })

                     }


                     $scope.addSelectedIndex = function (index,checkBox){
                          $scope.selectedIndices.push(index);

                     }

});