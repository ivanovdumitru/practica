<?php
/**
 * Created by PhpStorm.
 * User: iuli
 * Date: 3/11/15
 * Time: 6:03 PM
 */

namespace B2B\BlogBundle\Services;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Buzz\Exception\RequestException;

class BuzzCurl {

    private $container;

    public function __construct(ContainerInterface $container, RequestStack $requestStack) {
        $this->request = $requestStack->getCurrentRequest();
        $this->container = $container;
    }

    /**
     * @param array $url
     * @return array
     */
    public function request($url)
    {
        $header = [
            sprintf(
                'Authorization: Token %s',
                $this->request->getSession()->get('auth')['token'])
        ];
        try {
            $httpResponse = $this->container->get('buzz')->get($url, $header);
        } catch (RequestException $e) {
            sleep(2);
            $httpResponse = $this->container->get('buzz')->get($url, $header);
        }

        return $httpResponse;
    }
}