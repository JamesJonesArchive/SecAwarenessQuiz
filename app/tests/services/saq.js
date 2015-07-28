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
        httpBackend.whenPOST("api/recordSAQuiz").respond(
            {"e911sign":true}
        );
        saqService.recordSAQuiz('ABCDEFGHIJKLMNOPQRSTUVWXYZ').then(function(response) {
            expect(response.data.e911sign).toEqual(true);
        });
        httpBackend.flush();
    });
});