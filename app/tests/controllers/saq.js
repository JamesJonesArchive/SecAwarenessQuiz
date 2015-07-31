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

describe('Controller: saqCtrl', function () {
    // load the controller's module
    beforeEach(module('saqApp'));

    var saqCtrl,
        saqService,
        filter,
        scope;
        
    beforeEach(function() {
        module(function($provide){
            $provide.factory('saqService', function() {
                var service;
                inject(function($q) {
                    service = {     
                        getSAQ: function() {
                            var defer = $q.defer(),
                                data = {
                                    "data": {
                                        "status":"success",
                                        "data":{
                                            "questions":{
                                                "status":"success",
                                                "data":[
                                                    {
                                                        "sa_id":"27",
                                                        "question":"Antivirus Software is not important if you have a MAC because MACS can't get viruses.",
                                                        "labels":"True|False"
                                                    },
                                                    {
                                                        "sa_id":"41",
                                                        "question":"How I use my computer affects others.",
                                                        "labels":"True|False"
                                                    },
                                                    {
                                                        "sa_id":"3",
                                                        "question":"You should have a different password on every system.",
                                                        "labels":"True|False"
                                                    },
                                                    {
                                                        "sa_id":"43",
                                                        "question":"Backing up your data is an outdated concept and is unimportant.",
                                                        "labels":"True|False"
                                                    },
                                                    {
                                                        "sa_id":"31",
                                                        "question":"My email privacy is not protected by law like postal mail.",
                                                        "labels":"True|False"
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                };                            
                            defer.resolve(data);
                            
                            return defer.promise;
                        },
                        recordSAQItem: function() {
                            var defer = $q.defer(),
                                data = {
                                    data: {
                                        "status":"success",
                                        "data":{
                                            "status":"success",
                                            "answer":"1",
                                            "explanation":"Links in your email can send you to scam websites that try to steal your password or other personal information."
                                        }
                                    }
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
    beforeEach(inject(function ($controller, $rootScope, $q, _$filter_, _saqService_) {
        $rootScope.id = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        scope = $rootScope.$new();
        filter = _$filter_;
        saqService = _saqService_;
        saqCtrl = $controller('saqCtrl', {
            $scope: scope,
            $q: $q,
            saqService: saqService
        });
        scope.$digest();
    }));
    
    describe('setup the rootScope', function () {
        it('has correct mock values', function() {
            expect(scope.id).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
            expect(scope.items.length).toBe(5);
        });               
        it('can answer', function() {   
            for (var i=0; i < scope.items.length; i++) {
                scope.items[i].selected = 1;
            }
            scope.submit(1);
            expect(filter('filter')(scope.items, {sa_id: "31"}).length).toBe(1);
            expect(scope.items[0].sa_id).toBe("27");
        });
    });
});