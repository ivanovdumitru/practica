<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Articles
 *
 * @ORM\Table(name="articles", indexes={@ORM\Index(name="Articles_0316dde1", columns={"company_id"}), @ORM\Index(name="Articles_80c06cbb", columns={"last_modified_user_id"}), @ORM\Index(name="Articles_406ec824", columns={"stampdevice_id"}), @ORM\Index(name="Articles_ffaba1d1", columns={"subject_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Entity\ArticlesRepository")
 */
class Articles
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
     * @ORM\Column(name="company_id", type="integer", nullable=false)
     */
    private $companyId;
    
    /**
     *
     * @ORM\ManyToOne(targetEntity="Companies", inversedBy = "articles")
     * @ORM\JoinColumn(name="company_id", referencedColumnName="C")
     */
    private $company;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255, nullable=false)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="body", type="text", nullable=false)
     */
    private $body;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created", type="datetime", nullable=false)
     */
    private $created;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=400, nullable=false)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="tags", type="string", length=200, nullable=true)
     */
    private $tags;

    /**
     * @var boolean
     *
     * @ORM\Column(name="published", type="boolean", nullable=false)
     */
    private $published;

    /**
     * @var integer
     *
     * @ORM\Column(name="last_modified_user_id", type="integer", nullable=false)
     */
    private $lastModifiedUserId;

    /**
     * @var string
     *
     * @ORM\Column(name="image", type="string", length=100, nullable=true)
     */
    private $image;

    /**
     * @var boolean
     *
     * @ORM\Column(name="swdelete", type="boolean", nullable=false)
     */
    private $swdelete;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="stampdate", type="datetime", nullable=false)
     */
    private $stampdate;

    /**
     * @var integer
     *
     * @ORM\Column(name="stampdevice_id", type="integer", nullable=true)
     */
    private $stampdeviceId;

    /**
     * @var integer
     *
     * @ORM\Column(name="subject_id", type="integer", nullable=true)
     */
    private $subjectId;

    /**
     * @var integer
     *
     * @ORM\Column(name="views", type="integer", options={"default" = 0})
     */
    private $views;



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
     * Set companyId
     *
     * @param integer $companyId
     *
     * @return Articles
     */
    public function setCompanyId($companyId)
    {
        $this->companyId = $companyId;

        return $this;
    }

    /**
     * Get companyId
     *
     * @return integer
     */
    public function getCompanyId()
    {
        return $this->companyId;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Articles
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set body
     *
     * @param string $body
     *
     * @return Articles
     */
    public function setBody($body)
    {
        $this->body = $body;

        return $this;
    }

    /**
     * Get body
     *
     * @return string
     */
    public function getBody()
    {
        return $this->body;
    }

    /**
     * Set created
     *
     * @param \DateTime $created
     *
     * @return Articles
     */
    public function setCreated($created)
    {
        $this->created = $created;

        return $this;
    }

    /**
     * Get created
     *
     * @return \DateTime
     */
    public function getCreated()
    {
        return $this->created;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Articles
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set tags
     *
     * @param string $tags
     *
     * @return Articles
     */
    public function setTags($tags)
    {
        $this->tags = $tags;

        return $this;
    }

    /**
     * Get tags
     *
     * @return string
     */
    public function getTags()
    {
        return $this->tags;
    }

    /**
     * Set published
     *
     * @param boolean $published
     *
     * @return Articles
     */
    public function setPublished($published)
    {
        $this->published = $published;

        return $this;
    }

    /**
     * Get published
     *
     * @return boolean
     */
    public function getPublished()
    {
        return $this->published;
    }

    /**
     * Set lastModifiedUserId
     *
     * @param integer $lastModifiedUserId
     *
     * @return Articles
     */
    public function setLastModifiedUserId($lastModifiedUserId)
    {
        $this->lastModifiedUserId = $lastModifiedUserId;

        return $this;
    }

    /**
     * Get lastModifiedUserId
     *
     * @return integer
     */
    public function getLastModifiedUserId()
    {
        return $this->lastModifiedUserId;
    }

    /**
     * Set image
     *
     * @param string $image
     *
     * @return Articles
     */
    public function setImage($image)
    {
        $this->image = $image;

        return $this;
    }

    /**
     * Get image
     *
     * @return string
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Set swdelete
     *
     * @param boolean $swdelete
     *
     * @return Articles
     */
    public function setSwdelete($swdelete)
    {
        $this->swdelete = $swdelete;

        return $this;
    }

    /**
     * Get swdelete
     *
     * @return boolean
     */
    public function getSwdelete()
    {
        return $this->swdelete;
    }

    /**
     * Set stampdate
     *
     * @param \DateTime $stampdate
     *
     * @return Articles
     */
    public function setStampdate($stampdate)
    {
        $this->stampdate = $stampdate;

        return $this;
    }

    /**
     * Get stampdate
     *
     * @return \DateTime
     */
    public function getStampdate()
    {
        return $this->stampdate;
    }

    /**
     * Set stampdeviceId
     *
     * @param integer $stampdeviceId
     *
     * @return Articles
     */
    public function setStampdeviceId($stampdeviceId)
    {
        $this->stampdeviceId = $stampdeviceId;

        return $this;
    }

    /**
     * Get stampdeviceId
     *
     * @return integer
     */
    public function getStampdeviceId()
    {
        return $this->stampdeviceId;
    }

    /**
     * Set subjectId
     *
     * @param integer $subjectId
     *
     * @return Articles
     */
    public function setSubjectId($subjectId)
    {
        $this->subjectId = $subjectId;

        return $this;
    }

    /**
     * Get subjectId
     *
     * @return integer
     */
    public function getSubjectId()
    {
        return $this->subjectId;
    }

    /**
     * Set views
     *
     * @param integer $views
     *
     * @return Articles
     */
    public function setViews($views)
    {
        $this->views = $views;

        return $this;
    }

    /**
     * Get views
     *
     * @return integer
     */
    public function getViews()
    {
        return $this->views;
    }
    
    /**
     * @return Company
     */
    public function getCompany()
    {
        return $this->company;
    }

    /**
     * @param Company $company
     * @return $this
     */
    public function setCompany(Companies $company)
    {
        $this->company = $company;

        return $this;
    }
}
