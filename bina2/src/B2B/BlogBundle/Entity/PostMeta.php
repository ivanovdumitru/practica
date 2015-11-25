<?php

namespace B2B\BlogBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * PostMeta
 *
 * @ORM\Table(name="post_meta")
 * @ORM\Entity(repositoryClass="B2B\BlogBundle\Entity\PostMetaRepository")
 */
class PostMeta
{
    /**
     * @var integer
     * @ORM\Id
     * @ORM\Column(name="id", type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var integer
     *
     * @ORM\Column(name="attributeId", type="smallint")
     */
    private $attributeId;

    /**
     * @var integer
     *
     * @ORM\Column(name="postId", type="integer")
     */
    private $postId;

    /**
     * @var string
     *
     * @ORM\Column(name="value", type="string", length=255)
     */
    private $value;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set attributeId
     *
     * @param integer $attributeId
     * @return PostMeta
     */
    public function setAttributeId($attributeId)
    {
        $this->attributeId = $attributeId;

        return $this;
    }

    /**
     * Get attributeId
     *
     * @return integer 
     */
    public function getAttributeId()
    {
        return $this->attributeId;
    }

    /**
     * Set postId
     *
     * @param integer $postId
     * @return PostMeta
     */
    public function setPostId($postId)
    {
        $this->postId = $postId;

        return $this;
    }

    /**
     * Get postId
     *
     * @return integer 
     */
    public function getPostId()
    {
        return $this->postId;
    }

    /**
     * Set value
     *
     * @param string $value
     * @return PostMeta
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * Get value
     *
     * @return string 
     */
    public function getValue()
    {
        return $this->value;
    }

}
