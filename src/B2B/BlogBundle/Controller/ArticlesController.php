<?php

namespace B2B\BlogBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Buzz\Exception\RequestException;

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
         * @var $httpRequest \Buzz\Browser
         * @var $httpResponse \Buzz\Message\Response
         */
        $url = $this->container->getParameter('api')['articles_list_url'];
        $header = [sprintf('Authorization: Token %s', $request->getSession()->get('auth')['token'])];
        try {
            $httpResponse = $this->container->get('buzz')->get(sprintf('%s?company=%d', $url, $companyId), $header);
        } catch (RequestException $e) {
            sleep(2);
            $httpResponse = $this->container->get('buzz')->get(sprintf('%s?company=%d', $url, $companyId), $header);
        }

        $data = ['articles' => json_decode($httpResponse->getContent(), true), 'title' => 'articles'];

        return $this->render('B2BBlogBundle:Articles:list.html.twig', compact('data'));
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
        $url = $this->container->getParameter('api')['articles_list_url'];
        $header = [sprintf('Authorization: Token %s', $request->getSession()->get('auth')['token'])];
        try {
            $httpResponse = $this->container->get('buzz')->get(sprintf('%s/%d', $url, $articleId), $header);
        } catch (RequestException $e) {
            sleep(2);
            $httpResponse = $this->container->get('buzz')->get(sprintf('%s/%d', $url, $articleId), $header);
        }

        $data = ['article' => json_decode($httpResponse->getContent(), true), 'title' => 'articles'];

        return $this->render('B2BBlogBundle:Articles:view.html.twig', compact('data'));
    }
}
