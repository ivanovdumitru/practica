<?php

namespace B2B\BlogBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ArticleControllerTest extends WebTestCase
{
    public function testIndex()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/');
    }

    public function testCompanyarticle()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/{articleId}');
    }

}
