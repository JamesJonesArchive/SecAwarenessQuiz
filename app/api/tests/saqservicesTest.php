<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace USF\SAQ\Test;

use GuzzleHttp\Client as HttpClient,
    GuzzleHttp\Message\Response,
    GuzzleHttp\Subscriber\Mock;

/**
 * Description of saqservicesTest
 *
 * @author james
 */
class saqservicesTest extends \PHPUnit_Framework_TestCase {
    /**
     * Tests a mock of the GuzzleClient. There is 
     * no handling in the current function as it simply
     * passes the result
     * 
     * @covers USF\SAQ\saqservices::getSAQ
     */
    public function testGetSAQ() {
        $sampleoutput = '{"status":"success","data":{"questions":{"status":"success","data":[{"sa_id":"19","question":"Sharing'
              .' commercial software with your friends and coworkers is ok as long as you don\'t charge them money.","labels"'
              .':"True|False"},{"sa_id":"35","question":"My computer is no value to hackers and they do not target me"'
              .',"labels":"True|False"},{"sa_id":"33","question":"Hacker create viruses and break into systems for financial '
              .'gain.","labels":"True|False"},{"sa_id":"31","question":"My email privacy is not protected by law like'
              .'postal mail.","labels":"True|False"},{"sa_id":"29","question":"My email is private and no one can read '
              .'it.","labels":"True|False"}]}}}';
        // Create a client
        $client = new HttpClient();
        // Create a mock subscriber and queue one response.
        $mock = new Mock([
            new Response(200,[],\GuzzleHttp\Stream\Stream::factory($sampleoutput))
        ]);        
        
        // Add the mock subscriber to the client.
        $client->getEmitter()->attach($mock);
        $r = $client->post($_SERVER['UNA_SERVICE'], [
            'body' => [
                'service' => 'getSAQ',
                'request' => json_encode([ 'id' => $_SERVER['ENCRYPT_BADGE'], 'count' => 5 ])
            ]
        ]);
        $this->assertEquals(200, $r->getStatusCode());
        $this->assertEquals(5,count(json_decode((string) $r->getBody(),true)['data']['questions']['data']));
    }
    /**
     * Tests a mock of the GuzzleClient. There is 
     * no handling in the current function as it simply
     * passes the result
     * 
     * @covers USF\SAQ\saqservices::recordSAQitem
     */
    public function testRecordSAQitem() {        
        // Create a client
        $client = new HttpClient();
        // Create a mock subscriber and queue one response.
        $mock = new Mock([
            new Response(200,[],\GuzzleHttp\Stream\Stream::factory(json_encode(["status" => "success","data" => ["status" => "success","answer" => "2","explanation" => "Nothing is 100% safe to use."]])))
        ]);
        // Add the mock subscriber to the client.
        $client->getEmitter()->attach($mock);
        $r = $client->post($_SERVER['UNA_SERVICE'], [
            'body' => [
                'service' => 'recordSAQItem',
                'request' => json_encode([ 'id' => $_SERVER['ENCRYPT_BADGE'],'answer' => 2, 'sa_id' => "39" ])
            ]
        ]);
        $this->assertEquals(200, $r->getStatusCode());
        $this->assertEquals("success",json_decode((string) $r->getBody(),true)['status']);
        $this->assertEquals(2,json_decode((string) $r->getBody(),true)['data']['answer']);
    }

}
