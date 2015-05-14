<?php
namespace B2B\BlogBundle\EventListener;

use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class TokenListener
{
    private $container;
    private $request;

    public function __construct(ContainerInterface $container, RequestStack $requestStack)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->container = $container;
    }

    public function onKernelController()
    {
        $session = $this->request->getSession();
        if (!$session->get('auth') || !isset($session->get('auth')['token'])) {
            $config = $this->container->getParameter('api');
            $params = json_encode([
                'username' => $config['login'],
                'password' => $config['password'],
                'mac_addr' => $config['mac_addr']
            ]);
            /**
             * @var $curl \Buzz\Browser
             */
            $curl = $this->container->get('buzz');
            /**
             * @var $response = \Buzz\Message\Response
             */
            $response = $curl->post($config['auth_url'], ['Content-type: application/json'], $params);
            $headers = $response->getHeaders();
            if (count($headers) && strpos($headers[0], '200') === false) {
                throw new \Exception ("Authentication error");
            }
            $responseData = json_decode($response->getContent(), true);

            $session->set('auth', ['token' => $responseData['results']['token']]);
        }
    }
}