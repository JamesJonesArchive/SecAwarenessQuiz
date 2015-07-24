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

'use strict';

describe('Controller: e911Ctrl', function () {
    // load the controller's module
    beforeEach(module('e911App'));

    var e911Ctrl,
        e911Service,
        scope;
        
    beforeEach(function() {
        module(function($provide){
            $provide.factory('e911Service', function() {
                var service;
                inject(function($q) {
                    service = {                        
                        e911sign: function() {
                            var defer = $q.defer(),
                                data = {
                                    e911sign: true
                                };                            
                            defer.resolve(data);
                            
                            return defer.promise;
                        }
                    };
                });
                return service;
            });
        });
    });        
    
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $q, _e911Service_) {
        $rootScope.id = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        scope = $rootScope.$new();
        e911Service = _e911Service_;
        e911Ctrl = $controller('e911Ctrl', {
            $scope: scope,
            $q: $q,
            e911Service: e911Service
        });
        scope.$digest();
    }));
    
    describe('setup the rootScope', function () {
        it('has correct mock values', function() {
            expect(scope.id).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
            scope.e911sign();
            // expect(scope.e911.e911sign).to.eventually.equal(true);
        });               
        it('can sign', function() {   
            // expect(scope.e911.e911sign).toBe(true);
        });
    });
});