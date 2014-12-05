<?php

namespace B2B\BlogBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


/**
 * @Route("/data")
 * @Template()
 */

class DataController extends Controller
{
    private $data = [
        'profiles' => [
            100 => [
                'id' => 100,
                'name' => 'Hippostudio',
                'type' => 'furniture for kitchen',
                'description' => 'Shop for kitchen furniture and dining room sets. Get new dining room furniture, dining tables, dining room table sets, dining chairs, bar stools, pub chairs, wine racks, pantries and china buffets for less. Save money. Live better.',
                'logo' => 'http://hippostudio.com/work/wp-content/uploads/2012/08/WOW-logoKitchenByAW.jpg',
                'created' => '29/11/2001',
                'emails' => ['contacts@hippostudio.com'],
                'phones' => [11111111111111, 22222222222222, 333333333333]
            ],
            101 => [
                'id' => 101,
                'name' => 'Urgent Plumber',
                'type' => 'plumber services',
                'description' => 'Residential, commercial, and emergency plumbing services from Mr. Rooter are available 24/7, and we never charge an overtime fee. Your schedule and plumbing are our top priorities, all with courtesy in mind.',
                'logo' => 'http://www.urgentplumber.com.au/images/logo.jpg',
                'created' => '29/11/2001',
                'emails' => ['contacts@urgentplumber.com.au'],
                'phones' => [11111111111111, 22222222222222, 333333333333]
            ]
        ],
        'articles' => [
            100 => [
                1416988854 => [
                    'id' => 1416988854,
                    'img' => 'http://www.lowes.com/images/Services/2014_CREDIT_LandingPage_CreditCard.png',
                    'title' => 'Etiam lacinia pharetra tellus sit amet malesuada',
                    'text' => 'Choose 5% off every day,* or select 6 months special financing with a $299 minimum purchase** when you use your Lowe\'s Consumer Credit Card.'
                ],
                1416988010 => [
                    'id' => 1416988010,
                    'img' => 'http://content.blueport.com/ProductImages/0/349310.jpg',
                    'title' => 'Suspendisse tincidunt tincidunt enim',
                    'text' => 'Praesent elementum et mi quis maximus. Suspendisse tincidunt tincidunt enim, et hendrerit nulla tincidunt vel. Donec ut ex hendrerit, dapibus felis vitae, blandit ipsum. Nulla pellentesque, dolor ac feugiat pellentesque, eros purus porta augue, non gravida metus turpis vel massa. Etiam lacinia pharetra tellus sit amet malesuada. Duis rutrum nec ligula ut imperdiet. Pellentesque rutrum convallis tristique. Sed nec dapibus mauris. Nulla massa odio, efficitur eu mi vel, pretium porta neque. Nullam molestie eget ante et vulputate. Nulla sed mi sit amet dolor lobortis vestibulum. Etiam ornare lacus vel aliquet accumsan. Integer maximus sed lectus ut sagittis.'
                ],
                1416988009 => [
                    'id' => 1416988009,
                    'img' => 'http://content.blueport.com/ProductImages/0/349794.jpg',
                    'title' => 'Morbi et nunc mauris',
                    'text' => 'Donec arcu dui, eleifend laoreet elementum eget, sodales sed justo. Integer at congue felis. Praesent sed est eget justo fringilla imperdiet quis cursus purus. Pellentesque sit amet dapibus turpis. Morbi et nunc mauris. Etiam et pretium ex. Curabitur id felis ex. Sed sed turpis quis nisl mattis iaculis. Fusce blandit mauris molestie ipsum tincidunt suscipit accumsan sed sapien. Sed risus libero, volutpat et neque a, rutrum scelerisque ligula. Nunc elit augue, convallis ac urna quis, mattis posuere urna. Etiam eleifend volutpat gravida. Pellentesque dictum nibh id mauris tristique lobortis. Curabitur ultricies maximus sapien, in pellentesque nisl imperdiet tincidunt. Suspendisse a elit vitae lacus molestie volutpat ac eu lacus. '
                ],
                1416988005 => [
                    'id' => 1416988005,
                    'img' => 'http://content.blueport.com/ProductImages/0/349307.jpg',
                    'title' => 'Cras id fringilla justo, sit amet hendrerit est',
                    'text' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fermentum in diam a sodales. Ut posuere semper urna, eu posuere nisl blandit at. Fusce non commodo diam. Nam a maximus ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras id fringilla justo, sit amet hendrerit est. Phasellus tincidunt quis est eget dignissim. In mattis venenatis purus a placerat. Etiam convallis tristique felis nec aliquam. Nulla facilisi. Mauris volutpat pharetra felis in pharetra. Sed odio lorem, mattis elementum justo a, scelerisque ultrices tellus. Curabitur condimentum massa sed orci venenatis, a pharetra mi tempor. Ut commodo tincidunt eros, fringilla dictum nibh viverra at. Donec efficitur efficitur arcu, vel cursus ante viverra hendrerit. '
                ]
            ],
            101 => [
                1416988854 => [
                    'id' => 1416988854,
                    'img' => 'http://content.blueport.com/ProductImages/0/347877.jpg',
                    'title' => 'Etiam lacinia pharetra tellus sit amet malesuada',
                    'text' => 'Choose 5% off every day,* or select 6 months special financing with a $299 minimum purchase** when you use your Lowe\'s Consumer Credit Card.'
                ],
                1416988010 => [
                    'id' => 1416988010,
                    'img' => 'http://content.blueport.com/ProductImages/0/349308.jpg',
                    'title' => 'Suspendisse tincidunt tincidunt enim',
                    'text' => 'Praesent elementum et mi quis maximus. Suspendisse tincidunt tincidunt enim, et hendrerit nulla tincidunt vel. Donec ut ex hendrerit, dapibus felis vitae, blandit ipsum. Nulla pellentesque, dolor ac feugiat pellentesque, eros purus porta augue, non gravida metus turpis vel massa. Etiam lacinia pharetra tellus sit amet malesuada. Duis rutrum nec ligula ut imperdiet. Pellentesque rutrum convallis tristique. Sed nec dapibus mauris. Nulla massa odio, efficitur eu mi vel, pretium porta neque. Nullam molestie eget ante et vulputate. Nulla sed mi sit amet dolor lobortis vestibulum. Etiam ornare lacus vel aliquet accumsan. Integer maximus sed lectus ut sagittis.'
                ],
                1416988009 => [
                    'id' => 1416988009,
                    'img' => 'http://content.blueport.com/ProductImages/0/349308.jpg',
                    'title' => 'Morbi et nunc mauris',
                    'text' => 'Donec arcu dui, eleifend laoreet elementum eget, sodales sed justo. Integer at congue felis. Praesent sed est eget justo fringilla imperdiet quis cursus purus. Pellentesque sit amet dapibus turpis. Morbi et nunc mauris. Etiam et pretium ex. Curabitur id felis ex. Sed sed turpis quis nisl mattis iaculis. Fusce blandit mauris molestie ipsum tincidunt suscipit accumsan sed sapien. Sed risus libero, volutpat et neque a, rutrum scelerisque ligula. Nunc elit augue, convallis ac urna quis, mattis posuere urna. Etiam eleifend volutpat gravida. Pellentesque dictum nibh id mauris tristique lobortis. Curabitur ultricies maximus sapien, in pellentesque nisl imperdiet tincidunt. Suspendisse a elit vitae lacus molestie volutpat ac eu lacus. '
                ],
                1416988005 => [
                    'id' => 1416988005,
                    'img' => 'http://content.blueport.com/ProductImages/0/349307.jpg',
                    'title' => 'Cras id fringilla justo, sit amet hendrerit est',
                    'text' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fermentum in diam a sodales. Ut posuere semper urna, eu posuere nisl blandit at. Fusce non commodo diam. Nam a maximus ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras id fringilla justo, sit amet hendrerit est. Phasellus tincidunt quis est eget dignissim. In mattis venenatis purus a placerat. Etiam convallis tristique felis nec aliquam. Nulla facilisi. Mauris volutpat pharetra felis in pharetra. Sed odio lorem, mattis elementum justo a, scelerisque ultrices tellus. Curabitur condimentum massa sed orci venenatis, a pharetra mi tempor. Ut commodo tincidunt eros, fringilla dictum nibh viverra at. Donec efficitur efficitur arcu, vel cursus ante viverra hendrerit. '
                ]
            ],
        ],
    ];

    /**
     * @Route("/profile/{clientId}", requirements={"clientId" = "\d+"})
     */
    public function profileAction($clientId)
    {
        $result = [];

        if (array_key_exists($clientId, $this->data['profiles'])) {
            $result = $this->data['profiles'][$clientId];
        }

        $response = new Response(json_encode($result));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    /**
     * @Route("/profiles/{limit}/{offset}", defaults={"limit" = null, "offset" = null}, requirements={"limit" = "\d+", "offset" = "\d+"}) )
     * @param null $offset
     * @param null $limit
     * @return Request
     */
    public function profilesAction($limit = null, $offset = null)
    {
        $data = array_slice($this->data['profiles'], $offset, $limit);
        $response = new Response(json_encode($data));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    /**
     * @Route("/articles/{client_id}/{limit}", defaults={"limit"=null}, requirements={"client_id" = "\d+"})
     *
     * @param $client_id
     * @param null $limit
     * @return Response
     */
    public function articlesAction($client_id, $limit=null)
    {
        $result = [];

        if (array_key_exists($client_id, $this->data['articles'])) {
            $result = $this->data['articles'][$client_id];
            if ($limit) {
                $result = array_slice($result, 0, $limit);
            }
        }
        $response = new Response(json_encode($result));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }





}
