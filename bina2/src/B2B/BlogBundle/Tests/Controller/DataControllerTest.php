<?php

namespace B2B\BlogBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DataControllerTest extends WebTestCase
{
    public function testArticleactionprofile()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/profile/{user_id}');
    }

    public function testArticle()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/article/{client_id}/{limit}');
    }

}
