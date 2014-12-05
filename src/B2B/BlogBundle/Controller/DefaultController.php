<?php

namespace B2B\BlogBundle\Controller;

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
     * @Route("/articles/{companyId}/{limit}", defaults={"limit"=null}, name="client_articles")
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function articlesAction(Request $request, $companyId, $limit = null)
    {
        /**
         * @var $httpRequest \Buzz\Browser
         * @var $httpResponse \Buzz\Message\Response
         */
        $url = $this->container->getParameter('api')['articles_list_url'];
        $httpResponse = $this->container->get('buzz')->get(
            sprintf(
                '%s://%s/'.$url,
                $request->getScheme(),
                $request->getHttpHost(),
                (int)$companyId,
                (int)$limit
            )
        );
        $data = json_decode($httpResponse->getContent(), true);
        return $this->render('B2BBlogBundle:Default:articles.html.twig', compact('data'));
    }
}
