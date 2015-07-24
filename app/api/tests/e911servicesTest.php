<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace USF\e911\Test;

use GuzzleHttp\Client as HttpClient,
    GuzzleHttp\Message\Response,
    GuzzleHttp\Subscriber\Mock;

/**
 * Description of e911servicesTest
 *
 * @author james
 */
class e911servicesTest extends \PHPUnit_Framework_TestCase {
    /**
     * Tests a mock of the GuzzleClient. There is 
     * no handling in the current function as it simply
     * passes the result
     */
    public function testE911sign() {
        // $encryptbadge
        // Create a client
        $client = new HttpClient();
        // Create a mock subscriber and queue one response.
        $mock = new Mock([
            new Response(200,[],\GuzzleHttp\Stream\Stream::factory(json_encode(['e911sign' => true])))
        ]);
        // Add the mock subscriber to the client.
        $client->getEmitter()->attach($mock);
        $r = $client->post($_SERVER['UNA_SERVICE'], [
            'body' => [
                'service' => 'e911sign',
                'request' => json_encode([ 'id' => $_SERVER['ENCRYPT_BADGE'] ])
            ]
        ]);
        $this->assertEquals(200, $r->getStatusCode());
        $this->assertEquals(json_decode((string) $r->getBody(),true),['e911sign' => true]);
    }

}
