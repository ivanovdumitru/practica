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
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function homeAction(Request $request)
    {
        $data = ['title' => 'Home'];

        return $this->render('B2BBlogBundle:Default:index.html.twig', compact('data'));
    }

}
