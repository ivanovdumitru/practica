<?php

namespace B2B\BlogBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * @Route("/articles")
 * @Template()
 */
class ArticlesController extends Controller
{

    /**
     * @Route("/{companyId}/{limit}", defaults={"limit"=null}, requirements={"companyId"="\d+"}, name="client_articles")
     * @param Request $request
     * @param $companyId
     * @param int $limit
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listAction(Request $request, $companyId, $limit = 0)
    {
        /**
         * @var $httpResponse \Buzz\Message\Response
         */
        $url = sprintf(
            '%s?company=%d',
            $this->container->getParameter('api')['articles_list_url'],
            $companyId
        );
        $httpResponse = $this->get('buzz.curl')->request($url);
        $data = [
            'articles' => json_decode($httpResponse->getContent(), true),
            'title'    => 'articles'
        ];

        return compact('data');
    }

    /**
     * @Route("/view/{articleId}", requirements={"articleId"="\d+"}, name="show_client_article")
     * @param Request $request
     * @param $articleId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function viewAction(Request $request, $articleId)
    {
        /**
         * @var $httpRequest \Buzz\Browser
         * @var $httpResponse \Buzz\Message\Response
         */
        $url = sprintf(
            '%s/%d',
            $this->container->getParameter('api')['articles_list_url'],
            $articleId
        );
        $httpResponse = $this->get('buzz.curl')->request($url);
        $data = [
            'article' => json_decode($httpResponse->getContent(), true),
            'title'   => 'articles'
        ];

        return compact('data');
    }
}
