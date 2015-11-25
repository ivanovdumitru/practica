<?php

namespace B2B\BlogBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class SearchController extends Controller
{
    /**
     * @Route("/search", name="search")
     * @param Request $request
     * @return JsonResponse
     */
    public function indexAction(Request $request)
    {
        $searchStr = $request->get('search');
        $url = $this->container->getParameter('api')['search_url'] . $searchStr;
        $httpResponse = $this->get('buzz.curl')->request($url);

        return new JsonResponse(json_decode($httpResponse->getContent(), true));
    }

}
