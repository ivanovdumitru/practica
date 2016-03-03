<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * PostMeta
 *
 * @ORM\Table(name="post_meta")
 * @ORM\Entity(repositoryClass="AppBundle\Entity\PostMetaRepository")
 */
class PostMeta
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var integer
     *
     * @ORM\Column(name="attributeId", type="smallint", nullable=false)
     */
    private $attributeid;

    /**
     * @var integer
     *
     * @ORM\Column(name="postId", type="integer", nullable=false)
     */
    private $postid;

    /**
     * @var string
     *
     * @ORM\Column(name="value", type="string", length=255, nullable=false)
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
     * Set attributeid
     *
     * @param integer $attributeid
     *
     * @return PostMeta
     */
    public function setAttributeid($attributeid)
    {
        $this->attributeid = $attributeid;

        return $this;
    }

    /**
     * Get attributeid
     *
     * @return integer
     */
    public function getAttributeid()
    {
        return $this->attributeid;
    }

    /**
     * Set postid
     *
     * @param integer $postid
     *
     * @return PostMeta
     */
    public function setPostid($postid)
    {
        $this->postid = $postid;

        return $this;
    }

    /**
     * Get postid
     *
     * @return integer
     */
    public function getPostid()
    {
        return $this->postid;
    }

    /**
     * Set value
     *
     * @param string $value
     *
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
