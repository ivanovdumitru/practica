<?php

namespace B2B\BlogBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Class ProfileController
 * @package B2B\BlogBundle\Controller
 * @Route("/profile")
 * @Template()
 */

class ProfileController extends Controller
{
    /**
     * @Route("/{clientId}", requirements={"clientId" = "\d+"}, name="client_profile")
     * @param Request $request
     * @param $clientId
     * @return array
     */
    public function indexAction(Request $request, $clientId)
    {
        /**
         * @var $httpRequest \Buzz\Browser
         * @var $httpResponse \Buzz\Message\Response
         */
        $url = $this->container->getParameter('api')['profiles_list_url'];
        $header = [sprintf('Authorization: Token %s', $request->getSession()->get('auth')['token'])];
        $httpRequest = $this->container->get('buzz');
        $httpResponse = $httpRequest->get(sprintf('%s/%d', $url, $clientId), $header);
        $data = json_decode($httpResponse->getContent(), true);

        return compact('data');
    }

    /**
     * @Route("")
     * @Route("/")
     * @param Request $request
     * @return array
     */
    public function listAction(Request $request)
    {
        /**
         * @var $httpRequest \Buzz\Browser
         * @var $httpResponse \Buzz\Message\Response
         */
        $url = $this->container->getParameter('api')['profiles_list_url'];
        $header = [sprintf('Authorization: Token %s', $request->getSession()->get('auth')['token'])];
        $httpRequest = $this->container->get('buzz');
        $httpResponse = $httpRequest->get($url, $header);
        $data = json_decode($httpResponse->getContent(), true);

        return compact('data');
    }
}
