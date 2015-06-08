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
     * @param Request $request
     * @param int $page
     * @param null $subjectId
     * @return \Symfony\Component\HttpFoundation\Response
     * @Route("/{page}/{subjectId}", requirements={"page": "\d+", "subjectId": "\d+"}, defaults={"page": 1, "subjectId": null}, name="home")
     */
    public function homeAction(Request $request, $page=1, $subjectId = null)
    {
        /**
         * @var $repo PostMetaRepository
         */
        // article list
        $articlesPerPage = $this->container->getParameter('page')['front_page_articles_per_page'];
        $apiUrl = $this->container->getParameter('api')['articles_list_url'];
        // pagination
        $offset = $page * $articlesPerPage - $articlesPerPage; // since previous page
        $url = sprintf('%s?limit=%d&offset=%d', $apiUrl, $articlesPerPage, $offset);
        if ($subjectId !== null) {
            $url .= sprintf('&subject_id=%d', $subjectId);
        }
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
        // assemble final data
        $data = [
            'articles' => $articles['results'],
            'count' =>  $count,
            'subjects' => $this->get('post.utility')->subjects(),
            'title' => 'ome',
            'popular' => $this->get('post.utility')->popular(5),
            'pagination' => ceil($articles['count'] / $this->container->getParameter('page')['front_page_articles_per_page'])
        ];

        return $this->render('B2BBlogBundle:Default:index.html.twig', compact('data'));
    }

}
