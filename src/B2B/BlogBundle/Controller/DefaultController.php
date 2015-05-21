<?php

namespace B2B\BlogBundle\Controller;

use B2B\BlogBundle\Entity\PostMetaRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * @Template()
 */

class DefaultController extends Controller
{
    /**
     * @Route("", name="home")
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function homeAction()
    {
        /**
         * @var $repo PostMetaRepository
         */
        $repo = $this->getDoctrine()->getRepository('B2BBlogBundle:PostMeta');
        $httpResponse = $this->get('buzz.curl')->request($this->container->getParameter('api')['articles_list_url']);
        $articles = json_decode($httpResponse->getContent(), true);
        $ids = $count = [];
        foreach ($articles as $article) {
            $ids[] = $article['id'];
        }
        foreach ($repo->getCount($ids) as $postData) {
            $count[$postData['postId']] = $postData['value'];
        }
        $data = [
            'articles' => $articles,
            'count' =>  $count,
            'title' => 'Home'
        ];

        return $this->render('B2BBlogBundle:Default:index.html.twig', compact('data'));
    }

}
