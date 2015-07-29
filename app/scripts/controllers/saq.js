/**
 * Copyright 2015 University of South Florida
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function (window, angular, undefined) {
    'use strict';
    angular
    .module('saqApp')
    .controller('saqCtrl', ['$scope','$window', '$location', '$routeParams','saqService', function ($scope,$window,$location,$routeParams,saqService) { 
        if('id' in $routeParams) {
            $scope.id = $routeParams.id;       
        }
            
        // load a set of quiz items
        $scope.getItems = function() {
            $scope.graded = false;
            $scope.message = "";
            $scope.items = [
                {sa_id: 1, question: "question 1", selected: 0, answer: 0, labels: ["True", "False"], explanation: "explain 1"},
                {sa_id: 2, question: "question 2", selected: 0, answer: 0, labels: ["True", "False"], explanation: ""}
            ];
        };
        $scope.getItems();
        
        // return false if any of the items have not been answered, true otherwise.
        $scope.quizComplete = function() {
            for (var i=0; i < $scope.items.length; i++) {
                if ($scope.items[i].selected === 0) {
                    return false;
                }
            }
            return true;
        };
        
        // return false if selected answer if not correct, true otherwise.
        $scope.itemCorrect = function(sa_id) {
            if ($scope.items[sa_id].selected !== $scope.items[sa_id].answer) {
                return false;
            }
            return true;
        };
        
        // return false if quiz contains any incorrect items, true otherwise.
        $scope.quizPassed = function() {
            for (var i=0; i < $scope.items.length; i++) {
                if ($scope.items[i].selected !== $scope.items[i].answer) {
                    return false;
                }
            }
            return true;
        };
        
        // process submits
        $scope.submit = function(action) {
            if (action === 1) { // record supplied answers and get correct answers with explanations
                console.log("HERE");
                $scope.graded = true;
                $scope.items[0].answer = 1;
                $scope.items[1].answer = 2;
                
                if ($scope.quizPassed()) {
                    $scope.message = "Congratulations, you passed the quiz!";
                } else {
                    $scope.message = "You must answer all questions correctly pass this quiz.";
                }
                
            } else if (action === 2) { // reload the items
                $scope.getItems();
            } else { // return to una
                
            }
       /*     
            saqService.recordSAQuiz($scope.id).then(function(data){
                
                
                $scope.saq = { saq: data.data };
                $window.parent.postMessage(JSON.stringify($scope.saq), "*");
            },function(response) {
                var data = response.data,
                    status = response.status;
                $scope.saq = { saq: data };
                alert("Error! You anwers could not be recorded!"+JSON.stringify(response));
                $window.parent.postMessage(JSON.stringify($scope.saq), "*");
            });
        */
        };   
    }]);
    
})(window, window.angular);

