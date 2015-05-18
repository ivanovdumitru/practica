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
     * @Route("", name="home")
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function homeAction()
    {
        $httpResponse = $this->get('buzz.curl')->request($this->container->getParameter('api')['articles_list_url']);
        $data = [
            'articles' => json_decode($httpResponse->getContent(), true),
            'title' => 'Home'
        ];

        return $this->render('B2BBlogBundle:Default:index.html.twig', compact('data'));
    }

}
