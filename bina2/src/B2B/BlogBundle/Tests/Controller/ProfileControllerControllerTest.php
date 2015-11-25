<?php

namespace B2B\BlogBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ProfileControllerControllerTest extends WebTestCase
{
    public function testIndex()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/{clientId}');
    }

    public function testList()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/');
    }

}
