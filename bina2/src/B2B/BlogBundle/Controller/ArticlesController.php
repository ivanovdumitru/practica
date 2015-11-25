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
     * @param $companyId
     * @param int $limit
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listAction($companyId, $limit = 10)
    {
        /**
         * @var $httpResponse \Buzz\Message\Response
         */
        $url = sprintf(
            '%s?company=%d&limit=%d',
            $this->container->getParameter('api')['articles_list_url'],
            $companyId,
            $limit
        );
        $httpResponse = $this->get('buzz.curl')->request($url);
        $articles = json_decode($httpResponse->getContent(), true);
        // views counter
        $repo = $this->getDoctrine()->getRepository('B2BBlogBundle:PostMeta');
        $ids = $count = [];
        foreach ($articles['results'] as $article) {
            $ids[] = $article['id'];
        }
        foreach ($repo->getCount($ids) as $postData) {
            $count[$postData['postId']] = $postData['value'];
        }
        $data = [
            'articles' => $articles['results'],
            'count' =>  $count,
            'title'    => 'articles',
            'subjects' => $this->get('post.utility')->subjects(),
            'popular' => $this->get('post.utility')->popular(5)
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
        $post = $this->get('post.utility')->postCounter($articleId);
        $url = sprintf(
            '%s/%d',
            $this->container->getParameter('api')['articles_list_url'],
            $articleId
        );
        $httpResponse = $this->get('buzz.curl')->request($url);
        $article = json_decode($httpResponse->getContent(), true);
        $data = [
            'article' => $article,
            'title'   => 'articles',
            'recent'  => $this->get('post.utility')->recent($article['company'], 6)['results'],
            'subjects' => $this->get('post.utility')->subjects(),
        ];

        return compact('data');
    }
}
