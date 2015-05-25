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
     * @param null $subjectId
     * @Route("/{subjectId}", requirements={"subjectId": "\d+"}, defaults={"subjectId": null}, name="home")
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function homeAction($subjectId = null)
    {
        /**
         * @var $repo PostMetaRepository
         */
        // article list
        if ($subjectId === null) {
            $url = sprintf('%s?limit=%d', $this->container->getParameter('api')['articles_list_url'], 12);
        } else {
            $url = sprintf('%s?subject_id=%d&limit=%d', $this->container->getParameter('api')['articles_list_url'], 12, $subjectId);
        }
        $httpResponse = $this->get('buzz.curl')->request($url);
        $articles = json_decode($httpResponse->getContent(), true);
        // views counter
        $repo = $this->getDoctrine()->getRepository('B2BBlogBundle:PostMeta');
        $ids = $count = [];
        foreach ($articles as $article) {
            $ids[] = $article['id'];
        }
        foreach ($repo->getCount($ids) as $postData) {
            $count[$postData['postId']] = $postData['value'];
        }
        // subject list
        $httpResponse = $this->get('buzz.curl')->request($this->container->getParameter('api')['articles_subjects_list_url']);
        $subjects = json_decode($httpResponse->getContent(), true);
        // assemble final data
        $data = [
            'articles' => $articles,
            'count' =>  $count,
            'subjects' => $subjects,
            'title' => 'ome',
            'popular' => $post = $this->get('post.utility')->popular(5)
        ];

        return $this->render('B2BBlogBundle:Default:index.html.twig', compact('data'));
    }

}
