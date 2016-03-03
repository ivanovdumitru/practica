<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Menu
 *
 * @ORM\Table(name="menu")
 * @ORM\Entity(repositoryClass="AppBundle\Entity\MenuRepository")
 */
class Menu
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_menu", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $idMenu;

    /**
     * @var string
     *
     * @ORM\Column(name="den_menu", type="string", length=50, nullable=false)
     */
    private $denMenu;



    /**
     * Get idMenu
     *
     * @return integer
     */
    public function getIdMenu()
    {
        return $this->idMenu;
    }

    /**
     * Set denMenu
     *
     * @param string $denMenu
     *
     * @return Menu
     */
    public function setDenMenu($denMenu)
    {
        $this->denMenu = $denMenu;

        return $this;
    }

    /**
     * Get denMenu
     *
     * @return string
     */
    public function getDenMenu()
    {
        return $this->denMenu;
    }
}
