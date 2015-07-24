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

namespace USF\e911;

use \JSend\JSendResponse;
use \USF\IdM\UsfConfig;
use \GuzzleHttp\Client;

/**
 * Description of e911services
 *
 * @author james
 */
class e911services {
    /**
     * Signs the disclosure by badge
     * 
     * @param type $encryptbadge
     * @return JSendResponse
     */
    public function e911sign($encryptbadge) {
        $config = new UsfConfig();
        $client = new Client([
            // You can set any number of default request options.
            'timeout'  => 2.0,
        ]);
        try {
            $r = $client->post($config->e911Config['unaService'], [
                'body' => [
                    'service' => 'e911sign',
                    'request' => json_encode([ 'id' => $encryptbadge ])
                ]
            ]);
            return new JSendResponse('success', json_decode((string) $r->getBody(),true));        
        } catch (Exception $e) {
            return new JSendResponse('fail', [
                'request' => $e->getRequest(),
                'response' => ($e->hasResponse())?$e->getResponse():"",
                'message' => $e->getMessage()
            ]); 
        }
    }
}
