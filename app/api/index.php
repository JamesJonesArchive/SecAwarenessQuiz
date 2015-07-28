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
try {
// Initialize Composer autoloader
    if (!file_exists($autoload = __DIR__ . '/vendor/autoload.php')) {
        throw new \Exception('Composer dependencies not installed. Run `make install --directory app/api`');
    }
    require_once $autoload;
    // Initialize Slim Framework
    if (!class_exists('\\Slim\\Slim')) {
        throw new \Exception(
        'Missing Slim from Composer dependencies.'
        . ' Ensure slim/slim is in composer.json and run `make update --directory app/api`'
        );
    }
    $app = new \Slim\Slim();
    $app->post('/recordSAQuiz', function() use($app) {
        $saqservices = new \USF\SAQ\saqservices();
        $signbody = json_decode($app->request->getBody(), true);
        if (array_key_exists('id', $signbody)) {
            $resp = $saqservices->recordSAQuiz($signbody["id"]);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody($resp->encode());
        } else {
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody((new \JSend\JSendResponse('fail', [
                'e911sign' => false
            ]))->encode());
        }
    });
    $app->run();
    
} catch(\Exception $ex) {
    http_response_code(500);
    header('Content-Type: application/json');
    error_log($ex->getMessage());
    echo json_encode(array(
        'status' => 500,
        'statusText' => 'Internal Server Error',
        'description' => $ex->getMessage(),
    ));    
}
