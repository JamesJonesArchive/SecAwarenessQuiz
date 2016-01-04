<?php

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

namespace USF\SAQ;

use \JSend\JSendResponse;
use \USF\IdM\UsfConfig;
use \GuzzleHttp\Client;

/**
 * Description of saqservices
 *
 * @author james
 */
class saqservices {
    /**
     * Get's a list of questions
     * 
     * @param type $encryptbadge
     * @return JSendResponse
     */
    public function getSAQ($encryptbadge, $session_ts, $quiz_ts) {
        $config = new UsfConfig();
        $client = new Client([
            // You can set any number of default request options.
            'timeout'  => 2.0,
        ]);
        try {
            $r = $client->post($config->secAwarenessQuizConfig['unaService'], [
                'body' => [
                    'service' => 'getSAQ',
                    'request' => json_encode([ 'id' => $encryptbadge, 'session_ts' => $session_ts, 'quiz_ts' => $quiz_ts, 'count' => 5 ])
                ]
            ]);
            $resp = json_decode((string) $r->getBody(),true);
            return new JSendResponse('success', $resp);                
        } catch (Exception $e) {
            return new JSendResponse('fail', [
                'request' => $e->getRequest(),
                'response' => ($e->hasResponse())?$e->getResponse():"",
                'message' => $e->getMessage()
            ]); 
        }
    }
    public function updateSAQ($encryptbadge, $session_ts, $quiz_ts, $correct) {
        $config = new UsfConfig();
        $client = new Client([
            // You can set any number of default request options.
            'timeout'  => 2.0,
        ]);
        try {
            $r = $client->post($config->secAwarenessQuizConfig['unaService'], [
                'body' => [
                    'service' => 'updateSAQ',
                    'request' => json_encode([ 'id' => $encryptbadge, 'session_ts' => $session_ts, 'quiz_ts' => $quiz_ts, 'correct' => $correct, 'count' => 5 ])
                ]
            ]);
            $resp = json_decode((string) $r->getBody(),true);
            return new JSendResponse('success', $resp);                
        } catch (Exception $e) {
            return new JSendResponse('fail', [
                'request' => $e->getRequest(),
                'response' => ($e->hasResponse())?$e->getResponse():"",
                'message' => $e->getMessage()
            ]); 
        }
    }
    /**
     * Records user's answer response to a quiz question
     * 
     * @param type $encryptbadge
     * @param type $sa_id
     * @param type $answer
     * @return JSendResponse
     */
    public function recordSAQitem($encryptbadge, $quiz_ts, $sa_id, $answer) {
        $config = new UsfConfig();
        $client = new Client([
            // You can set any number of default request options.
            'timeout'  => 2.0,
        ]);
        try {
            $r = $client->post($config->secAwarenessQuizConfig['unaService'], [
                'body' => [
                    'service' => 'recordSAQItem',
                    'request' => json_encode([ 'id' => $encryptbadge, 'sa_id' => $sa_id, 'answer' => $answer, 'quiz_ts' => $quiz_ts ])
                ]
            ]);
            $resp = json_decode((string) $r->getBody(),true);
            return new JSendResponse('success', $resp);                
        } catch (Exception $e) {
            return new JSendResponse('fail', [
                'request' => $e->getRequest(),
                'response' => ($e->hasResponse())?$e->getResponse():"",
                'message' => $e->getMessage()
            ]); 
        }
    }

    // record all answers and return pass/fail
    public function recordSAQ($encryptbadge,$sa_id,$answer) {
        $config = new UsfConfig();
        $client = new Client([
            // You can set any number of default request options.
            'timeout'  => 2.0,
        ]);
        try {
            $r = $client->post($config->secAwarenessQuizConfig['unaService'], [
                'body' => [
                    'service' => 'recordSAQItem',
                    'request' => json_encode([ 'id' => $encryptbadge, 'sa_id' => $sa_id, 'answer' => $answer ])
                ]
            ]);
            $resp = json_decode((string) $r->getBody(),true);
            return new JSendResponse('success', $resp);                
        } catch (Exception $e) {
            return new JSendResponse('fail', [
                'request' => $e->getRequest(),
                'response' => ($e->hasResponse())?$e->getResponse():"",
                'message' => $e->getMessage()
            ]); 
        }
    }
    
}
