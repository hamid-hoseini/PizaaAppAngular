var pizzaApp = angular.module('pizzaApp',['ngSanitize','ui.router','ui.select','ui.bootstrap'])
    .config(function(uiSelectConfig) {
        uiSelectConfig.theme = 'selectize';
    })
    .factory('pizzaService', function($http) {
        var runUserRequest = function() {
            return $http({method: 'GET',
                url: 'public/data.json'
            });
        }
        return {
            pizzaData: function() {
                return runUserRequest();
            }
        };
    })
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/order');
        $stateProvider
            // HOME STATES AND NESTED VIEWS ========================================
            .state('order', {
                url: '/order',
                templateUrl: 'partials/order.html'
            })

            // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
            .state('toppings', {
                url: '/toppings',
                templateUrl: 'partials/toppings.html'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'partials/register.html'
            })
            .state('signin', {
                url: '/signin',
                templateUrl: 'partials/signin.html'
            });

    })
    .controller('appCtrl', function ($scope,pizzaService, $modal, $log) {
        $scope.message = "Hello World";
        $scope.allToppings=[];
        pizzaService.pizzaData().success(function (data){
            $scope.pizzaData = data.data;
            $scope.allToppings= data.all_toppings;
            //console.log($scope.pizzaData);
            $scope.cityname = {};
            $scope.show = false;
        });

        $scope.cityFunction =function (item){
            $scope.allFranchise = item.all_franchise;
        }

        $scope.franchiseFunction= function(item){
            $scope.pizzaNames= item.pizza_names;
            $scope.show = true;
        }
        $scope.ordered ={};
        $scope.toppSelection = [];
        $scope.selectedPizza = function(item){
            $scope.toppSelection = [];
            $scope.allToppings.forEach(function (element) {
                if (item.type === element.type) {
                    $scope.topp = element.toppings;
                }
            });
            $scope.ordered = {
                id : item.id,
                type: item.type,
                name: item.name,
                image: item.image,
                toppings : $scope.topp
            };
        }

        $scope.toggleSelection = function toggleSelection(item) {
            var idx = $scope.toppSelection.indexOf(item);
            if ( idx > -1){
                $scope.toppSelection.splice(idx,1);
            }
            else{
                $scope.toppSelection.push(item);
            }
        }

        $scope.disabled = undefined;

        $scope.enable = function() {
            $scope.disabled = false;
        };

        $scope.disable = function() {
            $scope.disabled = true;
        };

        $scope.clear = function() {
            $scope.cityname.selected = undefined;
        };

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'modal.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return {
                            mySelect: $scope.ordered,
                            toppSelection: $scope.toppSelection
                        }
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    })
    .controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {
       if (items.toppSelection.length==0){
           $scope.showTopp = false;
           $scope.showNoTopp = true;
       }
        else{
           $scope.showTopp = true;
           $scope.showNoTopp = false;
       }
        $scope.mySelect=items.mySelect;
        $scope.toppSelection= (items.toppSelection).join(', ');

        $scope.ok = function () {
            //$modalInstance.close($scope.selected.item);
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
});