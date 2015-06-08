<?php

namespace B2B\BlogBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * @Route("/profiles")
 * @Template()
 */
class ProfileController extends Controller
{
    /**
     * @Route("/{companyId}", requirements={"companyId" = "\d+"}, name="client_profile")
     * @param Request $request
     * @param $companyId
     * @return array
     */
    public function indexAction(Request $request, $companyId)
    {
        /**
         * @var $httpResponse \Buzz\Message\Response
         */
        $url = sprintf(
            '%s%d',
            $this->container->getParameter('api')['profiles_list_url'],
            $companyId
        );
        $httpResponse = $this->get('buzz.curl')->request($url);
        $data = [
            'profile' => json_decode($httpResponse->getContent(), true),
            'subjects' => $this->get('post.utility')->subjects(),
            'title' => 'profile',
            'popular' => $post = $this->get('post.utility')->popular(5)
        ];

        return compact('data');
    }

    /**
     * @Route("")
     * @Route("/", name="profiles_list")
     * @param Request $request
     * @return array
     */
    public function listAction(Request $request)
    {
        /**
         * @var $httpResponse \Buzz\Message\Response
         */
        $url = $this->container->getParameter('api')['profiles_list_url'];
        $httpResponse = $this->get('buzz.curl')->request($url);
        $data = [
            'profiles' => json_decode($httpResponse->getContent(), true)['results'],
            'subjects' => $this->get('post.utility')->subjects(),
            'title' => 'profile list',
            'popular' => $post = $this->get('post.utility')->popular(5)
        ];

        return compact('data');
    }
}
