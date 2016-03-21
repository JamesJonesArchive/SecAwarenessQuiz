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

    angular.module('saqApp')
        .factory('saqService', ['$http', function ($http) {
            var service = {
                recordSAQItem: function (id,quiz_ts,sa_id,answer) {
                    return $http.post('api/recordSAQItem', {id: id, quiz_ts: quiz_ts, sa_id: sa_id,answer: answer});
                },
                getSAQ: function(id, session_ts, quiz_ts) {
                    return $http.post('api/getSAQ', {id: id, session_ts: session_ts, quiz_ts: quiz_ts});
                },
                updateSAQ: function(id, session_ts, quiz_ts, correct) {
                    return $http.post('api/updateSAQ', {id: id, session_ts: session_ts, quiz_ts: quiz_ts, correct: correct});
                }
            };
            return service;
        }])
        .directive('focusOn', function() {
            return function(scope, elem, attr) {
                scope.$on('focusOn', function(e, name) {
                    if(name === attr.focusOn) {
                        elem[0].focus();
                    }
                });
            };
        });
})(window, window.angular);