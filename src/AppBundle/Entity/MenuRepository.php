<?php

namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\QueryBuilder;

/**

 */
class MenuRepository extends \Doctrine\ORM\EntityRepository
{
    function showAction(){
//       $repository = $this->getDoctrine()
//            ->getRepository('AppBundle:Menu');
//       $menu = $repository->findAll();
//       return $menu->getResult();
        $db = $this->createQueryBuilder('Menu');    
         $query = $db->getQuery();
         return $query->execute();
/*        
        $result = [];
        $query = $this->createQueryBuilder('menu')
            ->addSelect('menu.id_menu id,
                        menu.den_menu denmenu')
            ->orderBy('menu.id_menu');    
        
        foreach ( $query->getQuery()->getResult() as $item ) {
                $result[] = [
                    'id' => $item['id'],
                    'denmenu' => $item['denmenu'],
                ];
            }
        
     return $result;*/   
    }
}
