<?php

namespace AppBundle\Entity;

/**
 * ArticlesRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ArticlesRepository extends \Doctrine\ORM\EntityRepository
{
    function showAction(){
//       $repository = $this->getDoctrine()
//            ->getRepository('AppBundle:Menu');
//       $menu = $repository->findAll();
//       return $menu->getResult();
         $db = $this->createQueryBuilder('Articles');    
         $query = $db->getQuery();
         return $query->execute();
    }
}