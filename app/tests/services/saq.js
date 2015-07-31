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

describe('Service: saq', function () {
    var saqService, httpBackend;
    
    // load the service's module
    beforeEach(module('saqApp'));

    // instantiate service
    beforeEach(inject(function (_saqService_, $httpBackend) {
        saqService = _saqService_;
        httpBackend = $httpBackend;
    }));
    
    it('testing saq sigining requests', function () {
        httpBackend.whenPOST("api/recordSAQItem").respond(
            {"status":"success","data":{"status":"success","answer":"1","explanation":"Links in your email can send you to scam websites that try to steal your password or other personal information."}}
        );
        saqService.recordSAQItem('ABCDEFGHIJKLMNOPQRSTUVWXYZ',"11",1).then(function(response) {
            expect(response.data.status).toEqual("success");
        });
        httpBackend.flush();
    });
});