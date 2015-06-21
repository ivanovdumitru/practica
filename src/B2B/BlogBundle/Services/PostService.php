<?php
/**
 * Created by PhpStorm.
 * User: iuli
 * Date: 3/11/15
 * Time: 6:03 PM
 */

namespace B2B\BlogBundle\Services;

use Symfony\Component\DependencyInjection\ContainerInterface;
use B2B\BlogBundle\Entity\PostMeta;
use Doctrine\ORM\EntityManager;

class PostService {

    public function __construct(ContainerInterface $container, EntityManager $em) {
        $this->em = $em;
        $this->container = $container;
    }

    /**
     * @param integer $postId
     * @return PostMeta
     */
    public function postCounter($postId)
    {
        /**
         * @var $postMeta PostMeta
         */
        $attributeId = $this->em
            ->getRepository('B2BBlogBundle:PostAttribute')
            ->findOneBy(['name' => 'views_count'])->getId();
        $postMeta = $this->em
            ->getRepository('B2BBlogBundle:PostMeta')
            ->findOneBy(['postId' => $postId, 'attributeId' => $attributeId]);
        if ($postMeta) {
            $postMeta->setValue((int)$postMeta->getValue() + 1);
        } else {
            $postMeta = new PostMeta();
            $postMeta->setAttributeId($attributeId)
                ->setPostId($postId)
                ->setValue(1);
        }
        $this->em->persist($postMeta);
        $this->em->flush();

        return $postMeta;
    }

    /**
     * list of recent post
     * @param integer $limit
     * @return array
     */
    public function popular($limit)
    {
        /**
         * @var $httpResponse \Buzz\Message\Response
         */
        $attributeId = $this->em->getRepository('B2BBlogBundle:PostAttribute')
            ->findOneBy(['name' => 'views_count'])->getId();
        $stmt = $this->em->getConnection()->prepare(
            'SELECT *
              FROM post_meta meta
              WHERE meta.value > 0
              AND meta.attributeId = :attributeId
              ORDER BY CONVERT(value, decimal) DESC
              LIMIT 5'
        );
        $stmt->execute(['attributeId' => $attributeId]);
        $posts = $stmt->fetchAll();
        $ids = [];
        $str = [];
        foreach ($posts as $post) {
            $ids[] = (int)$post['postId'];
            $str[] = sprintf('%s=%d', urlencode('in_ids[]'), $post['postId']);
        }
        $url = sprintf(
            '%s/?%s&limit=%d',
            $this->container->getParameter('api')['articles_list_url'],
            join('&', $str),
            $limit
        );
        $httpResponse = $this->container->get('buzz.curl')->request($url)->getContent();
        $data = json_decode($httpResponse, true)['results'];

        foreach ($data as $post) {
            if (false !== $index = array_search($post['id'], $ids)) {
                $ids[$index] = $post;
            }
        }

        return $ids;
    }

    /**
     * subject list
     * @param null|integer $limit
     * @return array
     */
    public function subjects($limit=null)
    {
        /**
         * @var $httpResponse \Buzz\Message\Response
         */
        $httpResponse = $this->container
            ->get('buzz.curl')
            ->request(
                $this->container->getParameter('api')['articles_subjects_list_url'] . ($limit ? sprintf('?limit=%d', $limit) : '')
            );

        return json_decode($httpResponse->getContent(), true)['results'];
    }

    /**
     * @param $companyId
     * @param $limit
     * @return mixed
     */
    public function recent($companyId, $limit=null)
    {
        /**
         * @var $httpResponse \Buzz\Message\Response
         */
        if ($limit) {
            $url = sprintf(
                '%s?company=%d&limit=%d',
                $this->container->getParameter('api')['articles_list_url'],
                $companyId,
                $limit
            );
        } else {
            $url = sprintf(
                '%s?company=%d',
                $this->container->getParameter('api')['articles_list_url'],
                $companyId
            );
        }
        $httpResponse = $this->container->get('buzz.curl')->request($url);

        return json_decode($httpResponse->getContent(), true);
    }

}