<?php
/**
 * Created by PhpStorm.
 * User: iuli
 * Date: 3/11/15
 * Time: 6:03 PM
 */

namespace B2B\BlogBundle\Services;

use B2B\BlogBundle\Entity\PostMeta;
use Doctrine\ORM\EntityManager;

class PostService {

    public function __construct(EntityManager $em) {
        $this->em = $em;
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
        $attributeId = $repository = $this->em
            ->getRepository('B2BBlogBundle:PostAttribute')
            ->findOneBy(['name' => 'views_count'])->getId();
        $postMeta = $this->em
            ->getRepository('B2BBlogBundle:PostMeta')
            ->findOneBy(['postId' => $postId, 'attributeId' => 1]);
        if ($postMeta) {
            $postMeta->setValue((int)$postMeta->getValue() + 1);
        } else {
            $postMeta = new PostMeta();
            $postMeta->setAttributeId($attributeId)
                ->setPostId($postId)
                ->setValue(1);
        }
        $this->persistPostCounter($postMeta);

        return $postMeta;
    }

    /**
     * @param PostMeta $postMeta
     */
    private function persistPostCounter(PostMeta $postMeta)
    {
        $this->em->persist($postMeta);
        $this->em->flush();
    }

}